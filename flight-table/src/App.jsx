import { Table, Chip } from '@heroui/react';

// Return flight costs from Prague (Czech Republic) to Lombok – flexible dates by month.
// Data shape matches Skyscanner-style calendar (e.g. skyscanner.cz/lety).
const ROUTE_LABEL = 'Czech Republic (CZ) → Lombok International';
const DEFAULT_ROWS = [
  { id: '1', month: '2026 March', price: '29,820', priceNote: null, isCheapest: false },
  { id: '2', month: '2026 April', price: '19,659', priceNote: null, isCheapest: false },
  { id: '3', month: '2026 May', price: '19,853', priceNote: null, isCheapest: false },
  { id: '4', month: '2026 June', price: null, priceNote: 'Continue to prices', isCheapest: false },
  { id: '5', month: '2026 July', price: '20,132', priceNote: null, isCheapest: false },
  { id: '6', month: '2026 August', price: null, priceNote: 'Continue to prices', isCheapest: false },
  { id: '7', month: '2026 September', price: '17,433', priceNote: null, isCheapest: true },
  { id: '8', month: '2026 October', price: '18,794', priceNote: null, isCheapest: false },
  { id: '9', month: '2026 November', price: null, priceNote: 'Continue to prices', isCheapest: false },
  { id: '10', month: '2026 December', price: '20,307', priceNote: null, isCheapest: false },
  { id: '11', month: '2027 January', price: null, priceNote: 'Continue to prices', isCheapest: false },
  { id: '12', month: '2027 February', price: null, priceNote: 'Continue to prices', isCheapest: false },
];

function App() {
  const [rows, setRows] = React.useState(DEFAULT_ROWS);

  React.useEffect(() => {
    const api = import.meta.env.VITE_DEALS_API || '';
    if (!api) return;
    fetch(`${api.replace(/\/$/, '')}/calendar?origin=PRG&destination=LOP`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => setRows(data.rows || DEFAULT_ROWS))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-xl font-semibold text-slate-800">
          Return flight costs
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          {ROUTE_LABEL} · Flexible dates by month
        </p>
        <Table variant="secondary" aria-label="Return flight costs by month">
          <Table.ScrollContainer>
            <Table.Content>
              <Table.Header>
                <Table.Column>Month</Table.Column>
                <Table.Column>From (return)</Table.Column>
                <Table.Column>Note</Table.Column>
              </Table.Header>
              <Table.Body items={rows}>
                {(item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell className="font-medium text-slate-800">
                      {item.month}
                    </Table.Cell>
                    <Table.Cell>
                      {item.price != null ? (
                        <span className="font-semibold tabular-nums">
                          from {item.price} Kč
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {item.isCheapest && (
                        <Chip size="sm" color="primary" variant="flat">
                          Cheapest month
                        </Chip>
                      )}
                      {item.priceNote && !item.isCheapest && (
                        <span className="text-slate-500 text-sm">{item.priceNote}</span>
                      )}
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  );
}

export default App;
