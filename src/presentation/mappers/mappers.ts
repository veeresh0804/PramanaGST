import { VendorRiskResponseDTO, InvestigationResponseDTO, GraphNodeDTO, GraphEdgeDTO } from '../dtos/contracts';
import { RiskAssessment, Invoice } from '../../domain/models/entities';

export class VendorRiskMapper {
  static toAPIResponse(assessments: RiskAssessment[]): VendorRiskResponseDTO {
    return {
      vendors: assessments.map(a => ({
        gstin: a.vendorGstin,
        risk_score: a.riskScore,
        risk_level: a.riskLevel
      }))
    };
  }
}

export class InvestigationMapper {
  static toAPIResponse(
    invoice: Invoice, 
    risk: RiskAssessment, 
    explanation: string,
    nodes: GraphNodeDTO[],
    edges: GraphEdgeDTO[]
  ): InvestigationResponseDTO {
    return {
      invoice_id: invoice.id,
      status: invoice.status,
      risk_score: risk.riskScore,
      explanation: explanation,
      graph_nodes: nodes,
      graph_edges: edges
    };
  }
}