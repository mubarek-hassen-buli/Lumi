'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import TiptapEditor from '@/components/editor/tiptap-editor';
import { ArrowLeft, Download, FileJson, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { UserNav } from '@/components/user-nav';

import { useEditorStore } from '@/store/editor-store';
import { useUIStore } from '@/store/ui-store';
import { exportToPdf, exportToDocx } from '@/lib/export-utils';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const id = params?.id as string;
    
    const { content, setContent, isSaving, setSaving, markSaved } = useEditorStore();
    const { autoSave } = useUIStore();
    const [htmlContent, setHtmlContent] = useState('');

    const { data: doc, isLoading } = useQuery({
        queryKey: ['document', id],
        queryFn: async () => {
            const { data } = await api<any>(`/api/documents/${id}`);
            return data;
        },
        enabled: !!id,
    });

    // Initialize content from doc
    useEffect(() => {
        if (doc?.generatedContent && !content) {
            setContent(doc.generatedContent);
        }
    }, [doc, setContent, content]);

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async (newContent: string) => {
            const { error } = await api(`/api/documents/${id}`, {
                method: 'PATCH',
                body: { generatedContent: newContent },
            });
            if (error) throw error;
        },
        onMutate: () => setSaving(true),
        onSuccess: () => {
            markSaved();
            toast.success("Changes saved");
        },
        onError: () => {
            setSaving(false);
            toast.error("Failed to save changes");
        }
    });

    // Debounced Save
    const debouncedContent = useDebounce(content, 2000);

    useEffect(() => {
        if (debouncedContent && doc && debouncedContent !== doc.generatedContent && autoSave) {
            updateMutation.mutate(debouncedContent);
        }
    }, [debouncedContent, autoSave]);

    const handleSave = () => {
        updateMutation.mutate(content);
    };

    const handleDownloadMarkdown = () => {
        if (!doc) return;
        const blob = new Blob([content || doc.generatedContent || doc.originalContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.title}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadPdf = async () => {
        if (!doc) return;
        const toastId = toast.loading("Generating PDF...");
        try {
            await exportToPdf('tiptap-wrapper', doc.title);
            toast.success("PDF exported", { id: toastId });
        } catch (error) {
            toast.error("Failed to export PDF", { id: toastId });
        }
    };

    const handleDownloadDocx = async () => {
        if (!doc) return;
        const toastId = toast.loading("Generating Word document...");
        try {
            await exportToDocx(htmlContent, doc.title);
            toast.success("DOCX exported", { id: toastId });
        } catch (error) {
            toast.error("Failed to export DOCX", { id: toastId });
        }
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-accent transition-colors">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleDownloadMarkdown}>
                                <FileText className="w-4 h-4 mr-2" />
                                Markdown (.md)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownloadPdf}>
                                <FileText className="w-4 h-4 mr-2" />
                                PDF Document (.pdf)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownloadDocx}>
                                <FileText className="w-4 h-4 mr-2" />
                                Word Document (.docx)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <UserNav />
                </div>
            </div>
            
            {/* Editor Area */}
            <div id="tiptap-wrapper" className="bg-card rounded-lg shadow-sm border min-h-[600px]">
                <TiptapEditor 
                    content={content || doc.generatedContent || doc.originalContent} 
                    onChange={(newContent) => {
                        setContent(newContent);
                    }}
                    onHtmlChange={(html) => {
                        setHtmlContent(html);
                    }}
                />
            </div>
        </div>
    );
}
