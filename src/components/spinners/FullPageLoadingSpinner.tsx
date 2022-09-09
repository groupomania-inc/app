import { FunctionComponent } from "react";

import LoadingSpinner from "./LoadingSpinner";

type FullPageLoadingSpinnerParams = {
    className: string;
};

const FullPageLoadingSpinner: FunctionComponent<FullPageLoadingSpinnerParams> = ({ className }) => (
    <div className="fixed top-0 flex h-screen w-screen items-center justify-center">
        <LoadingSpinner className={className} />
    </div>
);

export default FullPageLoadingSpinner;
