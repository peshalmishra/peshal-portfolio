import { About } from "@/components/About";
import { PageTransition } from "@/components/PageTransition";

export default function AboutPage() {
    return (
        <PageTransition>
            <div className="w-full">
                <About />
            </div>
        </PageTransition>
    );
}
