import React, { useEffect } from "react";
import { useState, useCallback } from "react";

import SiteHeader from "./SiteHeader";
import SiteBody from "./SiteBody";
import { HomonymFinderQuery } from "./__generated__/HomonymFinderQuery.graphql";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import graphql from "babel-plugin-relay/macro";
import ModelLink from "./ModelLink";

const PossibleHomonym = ({
  homonym,
}: {
  homonym: NonNullable<
    HomonymFinderQuery["response"]["speciesHomonyms"]
  >["homonyms"][0];
}) => {
  return (
    <>
      <ModelLink model={homonym.name} />
      <ul>
        {homonym.exactNameMatch && (
          <li>This name's specific epithet exactly matches the query.</li>
        )}
        {homonym.fuzzyNameMatch && !homonym.exactNameMatch && (
          <li>
            This name's specific epithet does not exactly match the query, but is close
            enough that it is likely still a homonym under ICZN Art. 58.
          </li>
        )}
        {homonym.editDistance !== null &&
          !homonym.fuzzyNameMatch &&
          !homonym.exactNameMatch && (
            <li>
              This name is likely not a homonym of the query name, but it is close (edit
              distance {homonym.editDistance}) and could lead to confusion.
            </li>
          )}
        {homonym.sameOriginalGenus && (
          <li>
            This name was originally placed in the query genus, making it a{" "}
            {!homonym.isCurrentHomonym && "potential "}primary homonym.
          </li>
        )}
        {homonym.sameCurrentGenus && !homonym.sameOriginalGenus && (
          <li>
            This name is currently placed in the query genus, making it a{" "}
            {!homonym.isCurrentHomonym && "potential "}secondary homonym.
          </li>
        )}
        {homonym.relatedGenus &&
          !homonym.sameCurrentGenus &&
          !homonym.sameOriginalGenus && (
            <li>
              This name is not currently a primary or secondary homonym, but is
              classified in a closely related genus and could become a homonym if the
              generic classification changes.
            </li>
          )}
      </ul>
    </>
  );
};

const HomonymRenderer = ({
  genusName,
  rootName,
}: {
  genusName: string;
  rootName: string;
}) => {
  return (
    <QueryRenderer<HomonymFinderQuery>
      environment={environment}
      query={graphql`
        query HomonymFinderQuery($genusName: String!, $rootName: String!) {
          speciesHomonyms(genusName: $genusName, rootName: $rootName) {
            genera {
              id
              ...ModelLink_model
            }
            homonyms {
              name {
                id
                ...ModelLink_model
              }
              exactNameMatch
              fuzzyNameMatch
              sameOriginalGenus
              sameCurrentGenus
              editDistance
              relatedGenus
              isCurrentHomonym
            }
          }
        }
      `}
      variables={{ genusName, rootName }}
      render={({ error, props }) => {
        if (error) {
          return <div>Error!</div>;
        }
        if (!props) {
          return <div>Loading...</div>;
        }
        if (!props.speciesHomonyms) {
          return <div>Error!</div>;
        }
        const { genera, homonyms } = props.speciesHomonyms;
        const numGenera = genera.length;
        if (numGenera === 0) {
          return (
            <div>
              Genus '<i>{genusName}</i>' was not found in the database.
            </div>
          );
        }
        const currentHomonyms = homonyms.filter((h) => h.isCurrentHomonym);
        const nearMisses = homonyms.filter((h) => !h.isCurrentHomonym);
        return (
          <>
            {numGenera > 1 && (
              <>
                <h3>Genera</h3>
                <p>
                  Multiple genera named '<i>{genusName}</i>' were found. Showing
                  possible homonyms in all.
                </p>
                <ul>
                  {genera.map((genus) => (
                    <li key={genus.id}>
                      <ModelLink model={genus} />
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h3>Homonyms</h3>
            {currentHomonyms.length === 0 ? (
              <p>No definite homonyms found.</p>
            ) : (
              <p>
                These names are likely to be senior homonyms of{" "}
                <i>
                  {genusName} {rootName}
                </i>
                .
              </p>
            )}
            <ul>
              {currentHomonyms.map((homonym) => (
                <li key={homonym.name.id}>
                  <PossibleHomonym homonym={homonym} />
                </li>
              ))}
            </ul>
            {nearMisses.length > 0 && (
              <>
                <h3>Near homonyms</h3>
                <p>
                  These names are likely not homonyms of the query name, but they are
                  close and could lead to confusion.
                </p>
                <ul>
                  {nearMisses.map((homonym) => (
                    <li key={homonym.name.id}>
                      <PossibleHomonym homonym={homonym} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        );
      }}
    />
  );
};

const HomonymSearchForm = () => {
  const params = new URLSearchParams(window.location.search);
  const [[genusName, rootName], setQuery] = useState<[string | null, string | null]>([
    params.get("genus"),
    params.get("epithet"),
  ]);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setQuery([e.target.genus.value, e.target.rootName.value]);
    },
    [setQuery],
  );
  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <p>
          <label htmlFor="query">Genus name</label>
          <input
            name="genus"
            defaultValue={genusName ?? undefined}
            style={{ marginLeft: "1em" }}
          />
        </p>
        <p>
          <label htmlFor="rootName">Epithet</label>
          <input
            name="rootName"
            defaultValue={rootName ?? undefined}
            style={{ marginLeft: "1em" }}
          />
        </p>
        <button type="submit">Submit</button>
      </form>
      {genusName && rootName && (
        <HomonymRenderer genusName={genusName} rootName={rootName} />
      )}
    </>
  );
};

export default function HomonymFinder() {
  useEffect(() => {
    document.title = "Hesperomys - Homonym finder";
  }, []);
  return (
    <>
      <SiteHeader>
        <>Homonym finder</>
      </SiteHeader>
      <SiteBody>
        <p>
          This is the Homonym Finder tool, which is designed to find possible homonyms
          for species and subspecies names.
        </p>
        <p>Instructions:</p>
        <ol>
          <li>Enter the name of the genus that the new species will be added to.</li>
          <li>
            Enter the species name. Use the masculine form (e.g., <i>rufus</i>, not{" "}
            <i>rufa</i>). If you are working with a subspecies, enter only the
            subspecific epithet.
          </li>
          <li>Click "Submit".</li>
        </ol>
        <p>Limitations include:</p>
        <ol>
          <li>
            The tool works only for taxa where this database has data (see{" "}
            <a href="/docs/scope">"Scope"</a>), primarily mammals.
          </li>
          <li>
            Homonymy depends on the classification adopted. The results shown are based
            on this database's current classification; if more or fewer genera are
            recognized, the set of homonyms found may change. To mitigate this problem,
            the tool also shows possible homonyms in closely related genera.
          </li>
          <li>
            Some of the Code's provisions around homonymy are open to interpretation or
            difficult to apply programmatically (e.g., whether a genus name is an
            emendation of another; whether two names with similar but not identical
            spellings are considered homonyms).
          </li>
          <li>Names may be missing from the database.</li>
        </ol>
        <h3>Search form</h3>
        <HomonymSearchForm />
      </SiteBody>
    </>
  );
}
