import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class MlService {
    private mlBaseUrl: string;

    constructor(
        private configService: ConfigService,
        private cacheService: CacheService,
    ) {
        this.mlBaseUrl = this.configService.get('ML_SERVICE_URL', 'http://localhost:5000');
    }

    async predictProjectEffectiveness(projectData: {
        category?: string;
        technologies?: string[];
        hasUrl?: boolean;
        hasGithub?: boolean;
        isFeatured?: boolean;
    }): Promise<{ effectiveness_score: number; confidence: string; suggestions: string[] }> {
        const cacheKey = `ml_project_${JSON.stringify(projectData)}`;
        const cached = this.cacheService.get<any>(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${this.mlBaseUrl}/ml/project-effectiveness`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });
            if (!response.ok) throw new Error('ML service error');
            const result = await response.json();
            this.cacheService.set(cacheKey, result, 600);
            return result;
        } catch {
            return { effectiveness_score: 50, confidence: 'low', suggestions: ['ML service unavailable'] };
        }
    }

    async forecastVisitorTrend(historicalCounts: number[]): Promise<{ trend: string; growth_rate: number; forecast: number; confidence: string }> {
        const cacheKey = `ml_trend_${historicalCounts.length}`;
        const cached = this.cacheService.get<any>(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${this.mlBaseUrl}/ml/visitor-trend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ historical_counts: historicalCounts }),
            });
            if (!response.ok) throw new Error('ML service error');
            const result = await response.json();
            this.cacheService.set(cacheKey, result, 600);
            return result;
        } catch {
            return { trend: 'unknown', growth_rate: 0, forecast: 0, confidence: 'low' };
        }
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

    async classifyMessage(message: string): Promise<{ category: string; confidence: number; label: string }> {
        try {
            const response = await fetch(`${this.mlBaseUrl}/ml/classify-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });
            if (!response.ok) throw new Error('ML service error');
            return await response.json();
        } catch {
            return { category: 'inquiry', confidence: 0, label: 'General Inquiry' };
        }
    }

    async validateEmail(email: string): Promise<{ score: number; category: string; reasons: string[] }> {
        try {
            const response = await fetch(`${this.mlBaseUrl}/ml/validate-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) throw new Error('ML service error');
            return await response.json();
        } catch {
            const spamDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com', 'sharklasers.com'];
            const domain = email.split('@')[1]?.toLowerCase() || '';
            let score = 80;
            const reasons: string[] = [];
            if (spamDomains.includes(domain)) {
                score = 10;
                reasons.push('Known temporary email domain');
            }
            if (email.length > 50) { score -= 20; reasons.push('Unusually long email address'); }
            if (/[0-9]{4,}/.test(email)) { score -= 10; reasons.push('Contains many digits, may be auto-generated'); }
            return { score: Math.max(0, score), category: score >= 60 ? 'valid' : score >= 20 ? 'suspicious' : 'spam', reasons };
        }
    }
}
