'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { File, Plus, FileText, Calendar, Trash2, Download, MoreVertical } from 'lucide-react';

import { toast } from "sonner";
import { useUserStore } from '@/store/user-store';
import { UserNav } from '@/components/user-nav';
import { exportToDocx } from '@/lib/export-utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DashboardPage() {
    const queryClient = useQueryClient();
    const { user } = useUserStore();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['documents'],
        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await api<any>(`/api/documents?cursor=${pageParam}`);
            return data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: 0,
    });

    const documents = data?.pages.flatMap(page => page.items) ?? [];

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await api(`/api/documents/${id}`, { method: 'DELETE' });
            if (error) throw error;
        },
        onMutate: async (deletedId) => {
            await queryClient.cancelQueries({ queryKey: ['documents'] });
            
            const previousDocs = queryClient.getQueryData(['documents']);
            
            queryClient.setQueryData(['documents'], (old: any) => ({
                ...old,
                pages: old.pages.map((page: any) => ({
                    ...page,
                    items: page.items.filter((doc: any) => doc.id !== deletedId),
                })),
            }));
            
            return { previousDocs };
        },
        onError: (err, deletedId, context) => {
            queryClient.setQueryData(['documents'], context?.previousDocs);
            toast.error("Failed to delete document. Please try again.");
        },
        onSuccess: () => {
            toast.success("Document deleted successfully");
        },
    });

    const handleDelete = (e: React.MouseEvent, id: number, title: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        toast(`Delete "${title}"?`, {
            description: "This action cannot be undone.",
            action: {
                label: "Delete",
                onClick: () => deleteMutation.mutate(id)
            },
            cancel: {
                label: "Cancel",
                onClick: () => {}
            }
        });
    };

    const handleDownloadMarkdown = (doc: any) => {
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

    const handleDownloadDocx = async (doc: any) => {
        const toastId = toast.loading("Generating Word document...");
        try {
            // Note: Dashboard doesn't have live HTML, so we export based on generatedContent
            // In a real app, you might want a Markdown-to-HTML converter here or a backend endpoint.
            // For now, we'll wrap the content in basic tags or use a simple converter.
            const simpleHtml = (doc.generatedContent || doc.originalContent)
                .split('\n')
                .map((line: string) => `<p>${line}</p>`)
                .join('');
            await exportToDocx(simpleHtml, doc.title);
            toast.success("DOCX exported", { id: toastId });
        } catch (error) {
            toast.error("Failed to export DOCX", { id: toastId });
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            {/* ... header ... */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {user ? `Welcome back, ${user.name}` : 'Documents'}
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage and create your legal documents.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link 
                        href="/create" 
                        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-md font-medium transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Document
                    </Link>
                    <UserNav />
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 rounded-xl border bg-card/50 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents?.map((doc: any) => (
                        <div 
                            key={doc.id} 
                            className="group block border rounded-xl p-6 bg-card hover:shadow-md transition-all hover:border-primary/50 relative overflow-hidden"
                        >
                             <div className="flex justify-between items-start mb-4">
                                <Link href={`/editor/${doc.id}`} className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <FileText className="w-6 h-6" />
                                </Link>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full capitalize">
                                        {doc.type}
                                    </span>
                                    
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleDownloadMarkdown(doc)}>
                                                <Download className="w-4 h-4 mr-2" />
                                                Markdown (.md)
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDownloadDocx(doc)}>
                                                <Download className="w-4 h-4 mr-2" />
                                                Word (.docx)
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={(e) => handleDelete(e as any, doc.id, doc.title)}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                             </div>
                             
                             <Link href={`/editor/${doc.id}`}>
                                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                    {doc.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(doc.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                             </Link>
                        </div>
                    ))}
                    
                    {documents?.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
                            <div className="p-4 bg-muted rounded-full mb-4">
                                <FileText className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">No documents yet</h3>
                            <p className="text-muted-foreground text-sm mt-1 max-w-sm text-center">
                                Create your first professional document using our AI generator.
                            </p>
                            <Link 
                                href="/create" 
                                className="mt-6 text-primary font-medium hover:underline"
                            >
                                Start creating &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Load More Button */}
            {hasNextPage && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isFetchingNextPage ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
}
