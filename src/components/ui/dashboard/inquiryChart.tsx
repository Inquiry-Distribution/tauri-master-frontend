import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "@/src/contexts";
import { Card } from "../card";
import { useEffect, useState } from "react";
import ButtonLoader from "../loader/buttonLoader";

interface ChartProps {
  data: { name: string; value: number }[];
  loading: boolean;
}

const CustomTooltip = ({ active, payload, tokens }: any) => {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0];
  const total = payload[0].payload.__total;

  const percentage = ((item.value / total) * 100).toFixed(1);

  return (
    <div
      className="text-md rounded-lg px-2 py-1 bg-surfaceElevated"
      style={{
        color: item.color,
      }}
    >
      {item.name}: {item.value} ({percentage}%)
    </div>
  );
};

export function InquiryStatusChart({ data, loading }: ChartProps) {
  const { tokens, isDark } = useTheme();
  const [displayTotal, setDisplayTotal] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading && data.length) {
      setReady(false);

      const t = setTimeout(() => {
        setReady(true);
      }, 50); // tiny sync delay for render flush

      return () => clearTimeout(t);
    }
  }, [loading, data]);
  const COLORS = [
    tokens.accent,
    tokens.success,
    tokens.warning,
    tokens.danger,
    tokens.textMuted,
  ];
  //   const STATUS_COLORS = {
  //   UNASSIGNED: tokens.textMuted,
  //   ASSIGNED: tokens.accent,
  //   IN_PROGRESS: tokens.warning,
  //   FOLLOW_UP: tokens.success,
  //   CLOSED: tokens.danger,
  // };
  // ✅ total calculation

  const total = data.reduce((sum, item) => sum + item.value, 0);

  //   useEffect(() => {
  //     let start = 0;
  //     const step = total / 20;

  //     const interval = setInterval(() => {
  //       start += step;
  //       if (start >= total) {
  //         setDisplayTotal(total);
  //         clearInterval(interval);
  //       } else {
  //         setDisplayTotal(Math.floor(start));
  //       }
  //     }, 20);

  //     return () => clearInterval(interval);
  //   }, [total]);
  //   useEffect(() => {
  //     if (loading) {
  //       setDisplayTotal(0);
  //       return;
  //     }

  //     let start = 0;
  //     const duration = 600;
  //     const steps = 20;
  //     const stepTime = duration / steps;
  //     const increment = total / steps;

  //     const interval = setInterval(() => {
  //       start += increment;

  //       if (start >= total) {
  //         setDisplayTotal(total);
  //         clearInterval(interval);
  //       } else {
  //         setDisplayTotal(Math.floor(start));
  //       }
  //     }, stepTime);

  //     return () => clearInterval(interval);
  //   }, [total, loading]);

  useEffect(() => {
    if (!ready) {
      setDisplayTotal(0);
      return;
    }

    let start = 0;
    const steps = 20;
    const increment = total / steps;

    const interval = setInterval(() => {
      start += increment;

      if (start >= total) {
        setDisplayTotal(total);
        clearInterval(interval);
      } else {
        setDisplayTotal(Math.floor(start));
      }
    }, 800 / steps); // 🔥 match pie animation duration

    return () => clearInterval(interval);
  }, [ready, total]);

  const chartDataWithTotal = data.map((d) => ({
    ...d,
    __total: total,
  }));
  return (
    <Card className="border-none! p-0!">
      <h3 style={{ color: tokens.text, marginBottom: 12 }}>Inquiry Status</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            // data={chartDataWithTotal}
            data={ready ? chartDataWithTotal : []}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={4}
            isAnimationActive={!loading}
            animationDuration={800}
            onAnimationEnd={() => setReady(true)}
            animationEasing="ease-out"
          >
            {/* {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))} */}
            {!loading &&
              data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}

            {/* ✅ CENTER TOTAL */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={tokens.text}
              style={{ fontSize: 20, fontWeight: 600 }}
            >
              {loading ? <ButtonLoader /> : displayTotal}
            </text>

            {/* ✅ label below total */}
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={tokens.textSec}
              style={{ fontSize: 12 }}
            >
              {loading ? "Calculating" : "Total"}
            </text>
          </Pie>

          <Tooltip
            content={<CustomTooltip tokens={tokens} />}
            // contentStyle={{
            //   background: tokens.tooltipBg,
            //   border: "none",
            //   borderRadius: "8px",
            //   color: "#fff",
            // }}
          />

          <Legend
            wrapperStyle={{
              color: tokens.textSec,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
