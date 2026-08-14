import { nextWalkStatus } from '@/features/walks/utils/walkStatus';

describe('nextWalkStatus', () => {
  it('transitions idle → start → active', () => {
    expect(nextWalkStatus('idle', 'start')).toBe('active');
  });

  it('transitions active → pause → paused → resume → active', () => {
    const paused = nextWalkStatus('active', 'pause');
    expect(paused).toBe('paused');
    expect(nextWalkStatus(paused, 'resume')).toBe('active');
  });

  it('transitions active → stop → idle', () => {
    expect(nextWalkStatus('active', 'stop')).toBe('idle');
    expect(nextWalkStatus('paused', 'stop')).toBe('idle');
  });

  it('ignores invalid transitions', () => {
    expect(nextWalkStatus('idle', 'pause')).toBe('idle');
    expect(nextWalkStatus('idle', 'resume')).toBe('idle');
    expect(nextWalkStatus('active', 'start')).toBe('active');
    expect(nextWalkStatus('paused', 'pause')).toBe('paused');
  });
});
