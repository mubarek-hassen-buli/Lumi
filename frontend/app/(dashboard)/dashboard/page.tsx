'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { File, Plus, FileText, Calendar } from 'lucide-react';

export default function DashboardPage() {
    const { data: documents, isLoading } = useQuery({
        queryKey: ['documents'],
        queryFn: async () => {
             const { data } = await api<any[]>("/api/documents");
             return data;
        }
    });

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                    <p className="text-muted-foreground mt-1">Manage and create your legal documents.</p>
                </div>
                <Link 
                    href="/create" 
                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-md font-medium transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Document
                </Link>
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
                        <Link 
                            key={doc.id} 
                            href={`/editor/${doc.id}`} 
                            className="group block border rounded-xl p-6 bg-card hover:shadow-md transition-all hover:border-primary/50 relative overflow-hidden"
                        >
                             <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full capitalize">
                                    {doc.type}
                                </span>
                             </div>
                             
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
        </div>
    );
}
