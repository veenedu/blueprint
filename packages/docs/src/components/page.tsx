import * as React from "react";

import { IPageData } from "documentalist/dist/client";
import { TagRenderer } from "../tags";

export interface IPageProps {
    page: IPageData;
    tagRenderers: { [tag: string]: TagRenderer };
}

export const Page: React.SFC<IPageProps> = ({ tagRenderers, page }) => {
    const pageContents = page.contents.map((node, i) => {
        if (typeof node === "string") {
            return <div className="docs-section pt-running-text" dangerouslySetInnerHTML={{ __html: node }} key={i} />;
        }

        // try rendering the tag,
        try {
            const renderer = tagRenderers[node.tag];
            if (renderer === undefined) {
                throw new Error(`Unknown @tag: ${node.tag}`);
            }
            return renderer(node, i, page);
        } catch (ex) {
            console.error(ex.message);
            return <h3><code>{ex.message}</code></h3>;
        }
    });
    return <div className="docs-page" data-page-id={page.reference}>{pageContents}</div>;
};