import BootstrapTable from "react-bootstrap/Table";
import * as React from "react";

export default function Table({
  data,
}: {
  data: [JSX.Element | string, JSX.Element | string | null][];
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
            <tr key={String(key)}>
              <td className="label">{key}</td>
              <td>{value}</td>
            </tr>
          );
        })}
      </tbody>
    </BootstrapTable>
  );
}
