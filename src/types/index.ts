export interface Supplier {
  id: string;
  name: string;
  location: string;
  supported_skus: string[];
  available_capacity: number;
  max_capacity: number;
  unit_cost: number;
  lead_time_days: number;
  reliability_score: number;
  carbon_per_unit: number;
  status: 'ACTIVE' | 'DISRUPTED' | 'CAPACITY_REDUCED' | 'INACTIVE';
  disruption_risk: number;
  moq: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  throughput_capacity: number;
  safety_stock: number;
  operating_status: 'OPERATIONAL' | 'DEGRADED' | 'SHUTDOWN';
}

export interface RetailStore {
  id: string;
  name: string;
  location: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  target_sla: number;
  deadline_hours: number;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  distance_km: number;
  travel_time_hours: number;
  transport_cost_per_unit: number;
  carbon_factor_per_km_unit: number;
  capacity: number;
  status: 'OPEN' | 'CONGESTED' | 'CLOSED' | 'DELAYED';
  risk_score: number;
}

export interface Inventory {
  id: number;
  location_type: 'WAREHOUSE' | 'RETAILER' | 'SUPPLIER';
  location_id: string;
  sku: string;
  quantity: number;
  safety_stock: number;
}

export interface CustomerDemand {
  id: string;
  store_id: string;
  sku: string;
  target_quantity: number;
  fulfilled_quantity: number;
  deadline_hours: number;
  priority: string;
  unmet_quantity: number;
}

export interface Disruption {
  id: string;
  type: 'SUPPLIER_SHUTDOWN' | 'CAPACITY_REDUCTION' | 'ROUTE_CLOSURE' | 'DEMAND_SPIKE' | 'PRICE_SHOCK';
  entity_type: string;
  entity_id: string;
  severity: number;
  description: string;
  status: 'ACTIVE' | 'MITIGATED' | 'RESOLVED';
  created_at: string;
}

export interface Plan {
  id: string;
  version: number;
  status: 'ACTIVE' | 'INVALIDATED' | 'EXECUTED' | 'SUPERSEDED';
  goal: string;
  actions: any[];
  cost: number;
  delay_hours: number;
  carbon_impact: number;
  expected_sla: number;
  resilience_score: number;
  invalidation_reason?: string;
  created_at: string;
}

export interface AgentTrace {
  id: number;
  task_id: string;
  step_index: number;
  phase: 'OBSERVE' | 'INVESTIGATE' | 'GENERATE' | 'OPTIMIZE' | 'ACT' | 'VERIFY' | 'REPLAN';
  evidence?: string;
  tool_called?: string;
  tool_input?: any;
  tool_output?: any;
  reasoning: string;
  created_at: string;
}

export interface NetworkState {
  suppliers: Supplier[];
  warehouses: Warehouse[];
  retail_stores: RetailStore[];
  routes: Route[];
  inventories: Inventory[];
  demands: CustomerDemand[];
  disruptions: Disruption[];
  kpis: {
    overall_service_level_pct: number;
    total_demand: number;
    total_fulfilled: number;
    unmet_demand: number;
    active_disruptions_count: number;
  };
}

export interface BenchmarkResult {
  scenario: string;
  nirvaha: {
    system_name: string;
    service_level_pct: number;
    recovery_time_hours: number;
    cost_inr: number;
    carbon_kg_co2: number;
    resilience_score: number;
    replans_count: number;
    verification_passed: boolean;
  };
  greedy_baseline: {
    system_name: string;
    service_level_pct: number;
    recovery_time_hours: number;
    cost_inr: number;
    carbon_kg_co2: number;
    resilience_score: number;
    replans_count: number;
    verification_passed: boolean;
  };
  improvement_pct: {
    service_level_delta: string;
    cost_reduction_pct: string;
    recovery_speedup_pct: string;
    carbon_reduction_pct: string;
  };
}
