import React, { useState } from 'react';
import { CompleteInput, Inspection, Location } from '../api/inspections';

type Props = {
  inspection: Inspection;
  locations: Location[];
  onSubmit: (input: CompleteInput) => void;
  onCancel: () => void;
};

export default function CompleteForm({ inspection, locations, onSubmit, onCancel }: Props) {
  const [locationId, setLocationId] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState<'Pass' | 'Fail'>('Pass');
  const [comments, setComments] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      locationId: Number(locationId),
      startedAt: new Date(startedAt).toISOString(),
      durationMinutes: Number(duration),
      result,
      ...(comments ? { comments } : {}),
    });
  }

  return (
    <form onSubmit={submit} className="card card-body mb-4">
      <h2 className="h5">Complete inspection #{inspection.id}</h2>

      <label className="form-label">Location</label>
      <select className="form-select mb-2" required value={locationId} onChange={e => setLocationId(e.target.value)}>
        <option value="">Select location</option>
        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
      </select>

      <label className="form-label">Start date and time</label>
      <input className="form-control mb-2" type="datetime-local" required value={startedAt} onChange={e => setStartedAt(e.target.value)} />

      <label className="form-label">Duration (minutes)</label>
      <input className="form-control mb-2" type="number" min={1} step={1} required value={duration} onChange={e => setDuration(e.target.value)} />

      <label className="form-label">Result</label>
      <select className="form-select mb-2" value={result} onChange={e => setResult(e.target.value as 'Pass' | 'Fail')}>
        <option value="Pass">Pass</option>
        <option value="Fail">Fail</option>
      </select>

      <label className="form-label">Comments</label>
      <textarea className="form-control mb-3" rows={3} maxLength={2000} value={comments} onChange={e => setComments(e.target.value)} />

      <div className="d-flex gap-2">
        <button className="btn btn-success">Submit</button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}