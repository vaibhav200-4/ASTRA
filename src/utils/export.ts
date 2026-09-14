import type { MissionLogItem } from '../types/mission';

export const exportMissionJson = (logs: MissionLogItem[], currentStep: number) => {
  const exportData = {
    mission_id: "BCE-01",
    device: "JETSON-XAVIER-NX-01",
    processing_mode: "OFFLINE",
    protocol: "BOX_AND_CONTAINER",
    generated_at: new Date().toISOString(),
    total_events: logs.length,
    events: logs.map(log => ({
      timestamp: log.utcTime,
      mission_elapsed_time: log.met,
      event_id: log.eventId,
      module: log.module,
      step: currentStep,
      activity: log.event,
      confidence: log.confidence / 100,
      fsm_state: log.fsmState,
      status: log.status.toLowerCase()
    }))
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ASTRA-PVT_BCE-01_LOG_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportMissionCsv = (logs: MissionLogItem[]) => {
  const headers = ['UTC TIME', 'MET', 'EVENT ID', 'MODULE', 'EVENT', 'CONFIDENCE (%)', 'FSM STATE', 'STATUS'];
  const rows = logs.map(log => [
    `"${log.utcTime}"`,
    `"${log.met}"`,
    `"${log.eventId}"`,
    `"${log.module}"`,
    `"${log.event.replace(/"/g, '""')}"`,
    log.confidence.toFixed(1),
    `"${log.fsmState}"`,
    `"${log.status}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ASTRA-PVT_BCE-01_LOG_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
