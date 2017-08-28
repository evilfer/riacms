export default function formatPath(path: string): string {
    return path.trim().replace(/(^\/)|(\/$)/g, "");
}
