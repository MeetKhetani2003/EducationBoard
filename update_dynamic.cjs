const fs = require('fs');
let clientApp = fs.readFileSync('app/ClientApp.tsx', 'utf8');

// Update HomePage
const homePageSearch = `function HomePage({ navigate }: { navigate: Navigate }) {
  const { cmsData } = React.useContext(CmsContext);
  const [dbNews, setDbNews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/editorial?kind=News")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setDbNews(data);
      })
      .catch((e) => console.error(e));
  }, []);`;

const homePageReplace = `function HomePage({ navigate }: { navigate: Navigate }) {
  const { cmsData } = React.useContext(CmsContext);
  const [dbNews, setDbNews] = useState<any[]>([]);
  const [dbProgs, setDbProgs] = useState<any[]>([]);
  const [dbResults, setDbResults] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/editorial?kind=News")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setDbNews(data);
      })
      .catch((e) => console.error(e));

    fetch("/api/programmes")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setDbProgs(data);
      })
      .catch((e) => console.error(e));

    fetch("/api/results/declared")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setDbResults(data);
      })
      .catch((e) => console.error(e));
  }, []);

  const displayProgs = dbProgs.length > 0 ? dbProgs : programmes;
  const displayResults = dbResults.length > 0 ? dbResults.map(r => ({...r, date: r.date ? new Date(r.date).toLocaleDateString() : "Recently"})) : resultRows;
`;

clientApp = clientApp.replace(homePageSearch, homePageReplace);

// Now replace resultRows.map with displayResults.map in HomePage
// And programmes.map with displayProgs.map in HomePage
// Since there's only one use in HomePage, we can use a targeted replace or a regex.
clientApp = clientApp.replace(
  `{resultRows.map((row) => (
              <button
                key={row.name}`,
  `{displayResults.slice(0, 4).map((row: any) => (
              <button
                key={row.name}`
);

clientApp = clientApp.replace(
  `{programmes.map((item) => (
              <button
                onClick={() => navigate("programmes")}
                key={item.title}`,
  `{displayProgs.map((item: any) => (
              <button
                onClick={() => navigate("programmes")}
                key={item.title}`
);

// Update ResultsPage
const resultsPageSearch = `function ResultsPage({ navigate }: { navigate: Navigate }) {
  return (`;

const resultsPageReplace = `function ResultsPage({ navigate }: { navigate: Navigate }) {
  const [dbResults, setDbResults] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/results/declared")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setDbResults(data);
      })
      .catch((e) => console.error(e));
  }, []);

  const displayResults = dbResults.length > 0 ? dbResults.map(r => ({...r, date: r.date ? new Date(r.date).toLocaleDateString() : "Recently"})) : resultRows;

  return (`;

clientApp = clientApp.replace(resultsPageSearch, resultsPageReplace);

clientApp = clientApp.replace(
  `{resultRows.map((row) => (
                    <tr key={row.name}`,
  `{displayResults.map((row: any) => (
                    <tr key={row.name}`
);

fs.writeFileSync('app/ClientApp.tsx', clientApp, 'utf8');
console.log('Updated ClientApp.tsx with dynamic progs and results');
