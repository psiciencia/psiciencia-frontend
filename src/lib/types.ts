export type Row = Record<string, number>;

export interface Health {
	status: boolean;
	model_configured: boolean;
	reference_data_available: boolean;
}

export interface InputColumn {
	name: string;
	type: string;
	required?: boolean;
}

export interface FeatureStats {
	min: number;
	max: number;
	mean: number;
}

export interface ModelInfo {
	model_uri: string;
	name: string | null;
	version: string | null;
	aliases: string[];
	created_at: number | null;
	run_id: string | null;
	experiment: string | null;
	params: Record<string, string>;
	metrics: Record<string, number>;
	input_schema: InputColumn[];
	reference: { rows: number; features: Record<string, FeatureStats> } | null;
}

export interface ColumnDrift {
	column: string;
	score: number;
	drifted: boolean | null;
}

export interface DriftSummary {
	drifted: number;
	share: number;
	total: number;
	columns: ColumnDrift[];
	rows: number;
}

export interface ModelVersion {
	version: number;
	aliases: string[];
	created_at: number;
	run_id: string | null;
	run_name: string | null;
	metrics: Record<string, number>;
	params: Record<string, string>;
}

export interface FeatureImportance {
	model_type: string;
	method: string;
	features: { feature: string; importance: number; sign: '+' | '-' | null }[];
}

export interface Evaluation {
	run_id: string;
	y_true: number[];
	y_pred: number[];
}

export type ReferenceHistogram =
	| { discrete: true; values: number[]; counts: number[] }
	| { discrete: false; edges: number[]; counts: number[] };

export interface ReferenceDistribution {
	rows: number;
	histograms: Record<string, ReferenceHistogram>;
}

export interface PlatformSummary {
	experiments: { name: string; runs: number; best_r2: number | null }[];
	registered_models: { name: string; versions: number; aliases: Record<string, string> }[];
	total_runs: number;
	total_versions: number;
}

/** Un intervalo (o categoría) del eje X de un histograma. */
export interface Bin {
	label: string;
	start?: number;
	end?: number;
}

export interface Curve {
	feature: string;
	points: { x: number; y: number }[];
	current: number;
}

export interface DistributionComparison {
	column: string;
	bins: Bin[];
	reference: number[];
	current: number[];
}
