
import { VendorRiskResponseDTO, InvestigationResponseDTO, GraphNodeDTO, GraphEdgeDTO, VendorRiskItemDTO } from '../dtos/contracts';
import { RiskAssessment, Invoice, Vendor, GraphNode, GraphEdge } from '../../domain/models/entities';

export class VendorRiskMapper {
  static toAPIResponse(vendors: Vendor[]): VendorRiskResponseDTO {
    return {
      vendors: vendors.map(v => ({
        gstin: v.gstin,
        name: v.name,
        risk_score: v.riskScore,
        risk_level: v.riskLevel,
        network_metrics: {
          chain_depth: v.networkMetrics?.chainDepth || 0,
          cluster_risk: v.networkMetrics?.clusterRisk || 0,
          degree_centrality: v.networkMetrics?.degreeCentrality || 0
        }
      } as VendorRiskItemDTO))
    };
  }
}

export class InvestigationMapper {
  static toAPIResponse(
    invoice: Invoice, 
    risk: RiskAssessment, 
    explanation: string,
    nodes: GraphNode[],
    edges: GraphEdge[]
  ): InvestigationResponseDTO {
    return {
      invoice_id: invoice.id,
      status: invoice.status as any,
      risk_score: invoice.riskScore,
      explanation: explanation,
      factors: risk.contributingFactors,
      graph: {
        nodes: nodes.map(n => ({
          id: n.id,
          label: n.label,
          type: n.type,
          risk_level: n.riskLevel as any
        })),
        edges: edges.map(e => ({
          source: e.source,
          target: e.target,
          type: e.type
        }))
      }
    };
  }
}
