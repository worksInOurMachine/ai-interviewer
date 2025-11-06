 
export default function Roadmap({ data }: { data: any }) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{data["1. Job Role Overview"]}</h1>

            <section>
                <h2 className="text-xl font-semibold">Skills Breakdown</h2>
                <ul className="list-disc ml-6">
                    {Object.entries(data["2. Skills Breakdown"]).map(([skill, desc]) => (
                        <li key={skill}>
                            <strong>{skill}:</strong> {desc as string}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold">Monthly Roadmap</h2>
                {Object.entries(data["3. Month-by-Month Roadmap"]).map(([month, details]) => (
                    <div key={month} className="border p-4 rounded my-2">
                        <h3 className="font-bold">{month}</h3>
                        <p>{(details as any)["Learning Goals"]}</p>

                        <h4 className="font-semibold mt-2">Topics to Study</h4>
                        <ul className="list-disc ml-6">
                            {(details as any)["Topics to Study"].map((t: string) => (
                                <li key={t}>{t}</li>
                            ))}
                        </ul>

                        <h4 className="font-semibold mt-2">Mini Projects</h4>
                        <ul className="list-disc ml-6">
                            {(details as any)["Practical Assignments / Mini-Projects"].map((p: any) => (
                                <li key={p}>{p}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        </div>
    );
}
