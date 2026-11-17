import { useEffect, useState } from 'react';
import { AuthUser } from '../api/client';
import {
  assignInspection,
  CompleteInput,
  completeInspection,
  createInspection,
  Inspection,
  Inspector,
  listInspectors,
  listInspections,
  Location,
} from '../api/inspections';
import CompleteForm from './CompleteForm';
import InspectionTable from './InspectionTable';

// The API client throws the raw response body; show Nest's "message" field.
function errorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : 'Something went wrong';
  try {
    const message = JSON.parse(raw).message;
    return Array.isArray(message) ? message.join(', ') : message ?? raw;
  } catch {
    return raw;
  }
}

export default function Inspections({ user, locations }: { user: AuthUser; locations: Location[] }) {
  const isManager = user.role === 'Manager';
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [inspectors, setInspectors] = useState<Inspector[]>([]);
  const [completing, setCompleting] = useState<Inspection | null>(null);
  const [error, setError] = useState('');

  const load = () => listInspections().then(setInspections);

  // Run an action, then refresh the list. Any error is shown at the top.
  async function run(action: () => Promise<unknown>) {
    setError('');
    try {
      await action();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  useEffect(() => {
    run(async () => {
      if (isManager) setInspectors(await listInspectors());
    });
  }, []);

  const handleComplete = (input: CompleteInput) =>
    run(async () => {
      await completeInspection(completing!.id, input);
      setCompleting(null);
    });

  return (
    <div className="mb-4">
      {error && <div className="alert alert-danger">{error}</div>}

      {isManager && (
        <button className="btn btn-primary mb-3" onClick={() => run(createInspection)}>Create inspection</button>
      )}

      {completing && (
        <CompleteForm
          inspection={completing}
          locations={locations}
          onSubmit={handleComplete}
          onCancel={() => setCompleting(null)}
        />
      )}

      <InspectionTable
        inspections={inspections}
        locations={locations}
        inspectors={inspectors}
        isManager={isManager}
        onAssign={(id, inspectorId) => run(() => assignInspection(id, inspectorId))}
        onComplete={setCompleting}
      />
    </div>
  );
}