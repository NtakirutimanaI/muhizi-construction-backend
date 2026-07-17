import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MlService {
    private mlBaseUrl: string;

    constructor(
        private configService: ConfigService,
    ) {
        this.mlBaseUrl = this.configService.get('ML_SERVICE_URL', 'http://localhost:5000');
    }

    async scoreLead(contactData: { name?: string; email?: string; phone?: string; company?: string; subject?: string; message?: string }): Promise<{ lead_score: number; priority: string; reasons: string[] }> {
        try {
            const response = await fetch(`${this.mlBaseUrl}/ml/lead-score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData),
            });
            if (!response.ok) throw new Error('ML service error');
            return await response.json();
        } catch {
            return { lead_score: 50, priority: 'medium', reasons: ['ML scoring unavailable'] };
        }
    }

}
