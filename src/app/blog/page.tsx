import { Blog } from "@/components/Blog";
import { PageTransition } from "@/components/PageTransition";

export default function BlogPage() {
    return (
        <PageTransition>
            <div className="pt-24 pb-12">
                <Blog />
            </div>
        </PageTransition>
    );
}
