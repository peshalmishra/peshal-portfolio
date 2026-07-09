import { Contact } from "@/components/Contact";
import { PageTransition } from "@/components/PageTransition";

export default function ContactPage() {
    return (
        <PageTransition>
            <div className="pt-24 pb-12">
                <Contact />
            </div>
        </PageTransition>
    );
}
