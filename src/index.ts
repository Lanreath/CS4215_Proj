import { initialise } from "conductor/dist/conductor/runner/util/";
import { SimpleLangEvaluator } from "./SimpleLangEvaluator";

// Initialise the runner plugin and conduit
const {runnerPlugin, conduit} = initialise(SimpleLangEvaluator);