'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateDocumentPage() {
    const [content, setContent] = useState('');
    const [type, setType] = useState('contract');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await api<any>("/api/documents/generate", {
                method: "POST",
                body: {
                    content,
                    type
                }
            });

            if (data) {
                router.push(`/editor/${data.id}`);
            } else {
                alert("Failed to generate document");
            }
        } catch (err) {
            console.error(err);
             alert("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl px-4">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </Link>

            <div className="text-center mb-10">
                 <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                 </div>
                 <h1 className="text-3xl font-bold tracking-tight">Create with AI</h1>
                 <p className="text-muted-foreground mt-2">Transform your messy notes into professional legal documents in seconds.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-card border p-8 rounded-xl shadow-sm">
                <div>
                     <label className="block text-sm font-medium mb-2">What are you creating?</label>
                     <select 
                        value={type} 
                        onChange={(e) => setType(e.target.value)}
                        className="w-full border rounded-lg p-2.5 bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                     >
                        <option value="contract">Legal Contract</option>
                        <option value="proposal">Business Proposal</option>
                        <option value="sow">Statement of Work (SOW)</option>
                     </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Paste your context
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="w-full border rounded-lg p-4 min-h-[200px] bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                        placeholder="e.g. I need a contract for a freelance web design project. Client is Acme Inc. Rate is $100/hr. Project starts next Monday..."
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                        {content.length} characters
                    </p>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Sparkles className="w-4 h-4 animate-spin" />
                                Generating Magic...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Document
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
