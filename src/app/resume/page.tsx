import { Resume } from "@/components/Resume";
import { PageTransition } from "@/components/PageTransition";

export default function ResumePage() {
    return (
        <PageTransition>
            <Resume />
        </PageTransition>
    );
}