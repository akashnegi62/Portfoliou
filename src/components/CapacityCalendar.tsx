import React from 'react';
import { ENGAGEMENT_TIERS, META } from '../data';

interface CapacityCalendarProps {
  withSelection?: boolean;
  selectedWeeks?: number;
}

export const CapacityCalendar: React.FC<CapacityCalendarProps> = ({
  withSelection = false,
  selectedWeeks = 0,
}) => {
  const sprint = ENGAGEMENT_TIERS[0];
  const build = ENGAGEMENT_TIERS[1];
  const advisory = ENGAGEMENT_TIERS[2];
  const total = META.totalWeeks;
  const cols = 18;
  const rows = Math.ceil(total / cols);
  const gap = 3;
  const cell = 14;
  const step = cell + gap;
  const vbW = cols * step - gap;
  const vbH = rows * step - gap;

  const bookedTotal = sprint.booked + build.booked + advisory.booked;
  const openTotal = total - bookedTotal;

  const rects = [];
  for (let i = 0; i < total; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = c * step;
    const y = r * step;

    let fill = '#171919';
    let stroke: string | undefined = 'rgba(254,254,255,0.25)';

    if (withSelection && i >= bookedTotal && i < bookedTotal + selectedWeeks) {
      fill = '#2E5FCE';
      stroke = undefined;
    } else if (i < sprint.booked) {
      fill = sprint.color;
      stroke = undefined;
    } else if (i < sprint.booked + build.booked) {
      fill = build.color;
      stroke = undefined;
    } else if (i < bookedTotal) {
      fill = advisory.color;
      stroke = undefined;
    }

    rects.push(
      <rect
        key={i}
        x={stroke ? x + 0.5 : x}
        y={stroke ? y + 0.5 : y}
        width={stroke ? cell - 1 : cell}
        height={stroke ? cell - 1 : cell}
        fill={fill}
        stroke={stroke}
        strokeWidth={stroke ? 1 : undefined}
      />
    );
  }

  return (
    <figure className="capacity-fig">
      <div
        className="capacity-svg-wrap"
        tabIndex={0}
        role="img"
        aria-label={`2027 studio calendar: ${bookedTotal} of ${total} weeks booked, ${openTotal} open.`}
      >
        <svg
          className="capacity-svg"
          viewBox={`0 0 ${vbW} ${vbH}`}
          shapeRendering="crispEdges"
          aria-hidden="true"
        >
          {rects}
        </svg>
      </div>
      <figcaption className="t-micro" style={{ marginTop: 8 }}>
        Fig. 1 — 2027 studio allocation: {total} sprint weeks total.
      </figcaption>
      <ul className="capacity-legend t-micro">
        <li className="legend-item">
          <span className="legend-swatch" style={{ background: sprint.color }} />
          Design Systems, {sprint.booked} wks booked
        </li>
        <li className="legend-item">
          <span className="legend-swatch" style={{ background: build.color }} />
          Product &amp; Graphics, {build.booked} wks booked
        </li>
        <li className="legend-item">
          <span className="legend-swatch" style={{ background: advisory.color }} />
          Advisory, {advisory.booked} wks booked
        </li>
        <li className="legend-item">
          <span
            className="legend-swatch"
            style={{ background: '#171919', border: '1px solid rgba(254,254,255,0.25)' }}
          />
          Open, {openTotal} wks
        </li>
        {withSelection && selectedWeeks > 0 && (
          <li className="legend-item">
            <span className="legend-swatch" style={{ background: '#2E5FCE' }} />
            Selected scope ({selectedWeeks} wks)
          </li>
        )}
      </ul>
    </figure>
  );
};
