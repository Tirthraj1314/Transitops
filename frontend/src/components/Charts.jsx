import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

function useChartTheme() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    tick: { fontSize: 12, fill: isDark ? "#94a3b8" : "#6b7280" },
    grid: isDark ? "#334155" : "#eee",
    tooltip: {
      contentStyle: {
        backgroundColor: isDark ? "#1e293b" : "#fff",
        border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
        borderRadius: 8,
        color: isDark ? "#e2e8f0" : "#1f2937",
        fontSize: 13,
      },
      labelStyle: { color: isDark ? "#94a3b8" : "#6b7280" },
    },
  };
}

export function TrendChart({ data = [], dataKey = "value", xKey = "label", color = "#2563eb" }) {
  const chartTheme = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis dataKey={xKey} tick={chartTheme.tick} />
        <YAxis tick={chartTheme.tick} />
        <Tooltip {...chartTheme.tooltip} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ComparisonChart({ data = [], dataKey = "value", xKey = "label", color = "#16a34a" }) {
  const chartTheme = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis dataKey={xKey} tick={chartTheme.tick} />
        <YAxis tick={chartTheme.tick} />
        <Tooltip {...chartTheme.tooltip} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
