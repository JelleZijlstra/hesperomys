import BootstrapTable from "react-bootstrap/Table";
import * as React from "react";

export default function Table({
  data,
}: {
  data: [string, JSX.Element | string | null][];
}) {
  return (
    <BootstrapTable>
      <tbody>
        {data.map((pair) => {
          const [key, value] = pair;
          if (!value) {
            return null;
          }
          return (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          );
        })}
      </tbody>
    </BootstrapTable>
  );
}
