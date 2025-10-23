// Lightweight API entrypoint that re-exports the existing ApiRequest hook
// This file is intentionally non-invasive: it only re-exports the hook so other modules can import from a single place
import ApiRequest from '../components/hooks/apiRequest.jsx';

export default ApiRequest;
export { ApiRequest };
