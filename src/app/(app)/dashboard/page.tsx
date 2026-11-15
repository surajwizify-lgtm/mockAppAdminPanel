import { Button } from "@base-ui/react";
import PageHeader from "../comp/Header";
import Container from "../comp/Container";
import Section from "../comp/Section";

export default function DashboardPage() {
    return (
        <div className="">
            <PageHeader header='Dashboard' subheader='See your stats'>

            </PageHeader>
            <Container>
                <Section>
                    <h1 className="text-2xl font-bold">Your Stats</h1>

                </Section>
            </Container>
        </div>
    )
}