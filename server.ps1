$port = 8080
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "IGNITE 2.0 Server active at $prefix"

$mime = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $req = $context.Request
            $res = $context.Response
            
            $localPath = $req.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrEmpty($localPath)) { $localPath = "index.html" }
            $localPath = [System.Uri]::UnescapeDataString($localPath).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = [System.IO.Path]::Combine($PSScriptRoot, $localPath)

            if ([System.IO.File]::Exists($filePath)) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
                $res.ContentType = $contentType
                $res.AddHeader("Cache-Control", "no-cache")
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $res.ContentLength64 = $bytes.Length
                if ($req.HttpMethod -ne "HEAD") {
                    $res.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $res.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $res.ContentLength64 = $msg.Length
                if ($req.HttpMethod -ne "HEAD") {
                    $res.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
            $res.Close()
        } catch {
            try { $context.Response.Close() } catch {}
        }
    }
} finally {
    try { $listener.Stop() } catch {}
}
