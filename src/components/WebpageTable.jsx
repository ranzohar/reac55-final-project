const SIZE_CLASSES = {
  sm: "text-sm [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1",
  md: "text-base [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2",
  lg: "text-lg [&_th]:px-8 [&_th]:py-6 [&_td]:px-8 [&_td]:py-6",
};

const WebpageTable = ({ headers, data, size = "md", striped = false }) => {
  const sizeClasses = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  return (
    <>
      <table
        className={`border-collapse border border-black
        [&_th]:border [&_td]:border
        [&_th]:border-black [&_td]:border-black
        [&_th]:text-center [&_td]:text-center
        table-auto w-full
        ${sizeClasses}`}
      >
        <thead>
          <tr>
            {headers.map((header, index) => {
              return <th key={index}>{header}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            return (
              <tr
                key={index}
                className={striped ? "odd:bg-gray-800 even:bg-grey-500" : ""}
              >
                {row.map((component, index) => {
                  return <td key={index}>{component}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default WebpageTable;
