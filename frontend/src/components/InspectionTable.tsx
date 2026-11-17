import { Inspection, Inspector, Location } from '../api/inspections';

type Props = {
  inspections: Inspection[];
  locations: Location[];
  inspectors: Inspector[]; 
  isManager: boolean;
  onAssign: (id: number, inspectorId: number) => void;
  onComplete: (inspection: Inspection) => void;
};

const nameOf = (list: { id: number; name: string }[], id: number | null) =>
  list.find(x => x.id === id)?.name ?? '-';

export default function InspectionTable({ inspections, locations, inspectors, isManager, onAssign, onComplete }: Props) {
  return (
    <table className="table table-bordered align-middle">
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          {isManager && <th>Assigned inspector</th>}
          <th>Location</th>
          <th>Started</th>
          <th>Duration (min)</th>
          <th>Result</th>
          <th>Comments</th>
          {!isManager && <th></th>}
        </tr>
      </thead>
      <tbody>
        {inspections.map(i => (
          <tr key={i.id}>
            <td>{i.id}</td>
            <td>{i.status}</td>
            {isManager && (
              <td>
                {i.status === 'Yet to Start' ? (
                  <select
                    className="form-select form-select-sm"
                    value={i.assignedInspectorId ?? ''}
                    onChange={e => onAssign(i.id, Number(e.target.value))}
                  >
                    <option value="" disabled>Assign to...</option>
                    {inspectors.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select>
                ) : nameOf(inspectors, i.assignedInspectorId)}
              </td>
            )}
            <td>{nameOf(locations, i.locationId)}</td>
            <td>{i.startedAt ? new Date(i.startedAt).toLocaleString() : '-'}</td>
            <td>{i.durationMinutes ?? '-'}</td>
            <td>{i.result ?? '-'}</td>
            <td>{i.comments ?? '-'}</td>
            {!isManager && (
              <td>
                {i.status === 'Yet to Start' && (
                  <button className="btn btn-sm btn-success" onClick={() => onComplete(i)}>Complete</button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}