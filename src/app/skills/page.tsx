import { Skills } from "@/components/Skills";
import { PageTransition } from "@/components/PageTransition";

export default function SkillsPage() {
    return (
        <PageTransition>
            <div className="pt-24 pb-12">
                <Skills />
            </div>
        </PageTransition>
    );
}
