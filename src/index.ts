import { initialise } from "conductor/dist/conductor/runner/util/";
import { RustEvaluator } from "./RustEvaluator";

// Initialise the runner plugin and conduit
const {runnerPlugin, conduit} = initialise(RustEvaluator);