'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import TiptapEditor from '@/components/editor/tiptap-editor';
import { ArrowLeft, Download, FileJson, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSaving(false);
        toast.success("Changes saved successfully");
    };

    const { data: doc, isLoading } = useQuery({
        queryKey: ['document', id],
        queryFn: async () => {
            const { data } = await api<any>(`/api/documents/${id}`);
            return data;
        },
        enabled: !!id
    });

    const handleDownloadMarkdown = () => {
        if (!doc) return;
        const blob = new Blob([doc.generatedContent || doc.originalContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.title}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen text-muted-foreground">
            Loading editor...
        </div>
    );
    
    if (!doc) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-xl font-bold">Document not found</h2>
                <button onClick={() => router.back()} className="text-primary mt-2 hover:underline">Go back</button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="p-2 hover:bg-accent rounded-full transition-colors"
                        aria-label="Back to dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold leading-none">{doc.title}</h1>
                        <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
                            <span className="capitalize bg-secondary px-2 py-0.5 rounded text-secondary-foreground text-xs font-medium">
                                {doc.type}
                            </span>
                            <span className="bg-muted px-2 py-0.5 rounded text-xs">
                                {doc.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleDownloadMarkdown}
                        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-accent transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Export MD
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
            
            {/* Editor Area */}
            <div className="bg-card rounded-lg shadow-sm border min-h-[600px]">
                <TiptapEditor 
                    content={doc.generatedContent || doc.originalContent} 
                    onChange={(newContent) => {
                        // Debounce autosave logic would go here
                    }} 
                />
            </div>
        </div>
    );
}
