import axios from 'axios';
import { NetworkState, AgentTrace, Plan, BenchmarkResult } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const fetchNetworkState = async (): Promise<NetworkState> => {
  const res = await axios.get(`${API_BASE}/network-state`);
  return res.data;
};

export const injectDisruption = async (
  disruption_type: string,
  entity_id: string,
  severity = 1.0,
  description = ''
) => {
  const res = await axios.post(`${API_BASE}/disruptions/inject`, {
    disruption_type,
    entity_id,
    severity,
    description
  });
  return res.data;
};

export const resetEnvironment = async () => {
  const res = await axios.post(`${API_BASE}/disruptions/reset`);
  return res.data;
};

export const triggerAgentRecovery = async (llm_provider = 'ollama') => {
  const res = await axios.post(`${API_BASE}/agent/recover`, { llm_provider });
  return res.data;
};

export const fetchAgentTraces = async (): Promise<AgentTrace[]> => {
  const res = await axios.get(`${API_BASE}/agent/traces`);
  return res.data;
};

export const fetchPlans = async (): Promise<Plan[]> => {
  const res = await axios.get(`${API_BASE}/plans`);
  return res.data;
};

export const fetchBenchmark = async (): Promise<BenchmarkResult> => {
  const res = await axios.get(`${API_BASE}/evaluation/benchmark`);
  return res.data;
};
