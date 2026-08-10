let _fromDashboard = false;

export function markNavFromDashboard() {
  _fromDashboard = true;
}

export function consumeNavFromDashboard(): boolean {
  const v = _fromDashboard;
  _fromDashboard = false;
  return v;
}
