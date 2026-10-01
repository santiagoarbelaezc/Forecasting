import math
from PIL import Image, ImageDraw

def render_master_icon(size=1024):
    """
    Renders an ultra-refined, minimalist monochrome icon for Time Series Forecasting.
    Multivariate harmonic series gracefully converging into a sharp forecasting vector.
    """
    scale = size / 512.0
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Base Squircle (Obsidian dark finish)
    pad = int(24 * scale)
    r = int(116 * scale)
    # Background
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, fill=(10, 12, 16, 255))
    # Subtle matte edge
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, outline=(255, 255, 255, 24), width=int(2.5 * scale))

    # 2. Cubic Bezier curve evaluator
    def cubic_bezier(p0, p1, p2, p3, steps=100):
        points = []
        for i in range(steps + 1):
            t = i / steps
            u = 1 - t
            tt = t * t
            uu = u * u
            uuu = uu * u
            ttt = tt * t
            x = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0]
            y = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1]
            points.append((x * scale, y * scale))
        return points

    # Define the 4 multivariate time series waves
    # Each wave has:
    # Segment 1 (Crest): p0 -> p1 -> p2 -> p3
    # Segment 2 (Trough): p3 -> p4 -> p5 -> p6
    # Segment 3 (Lift & Convergence to Forecast Vector): p6 -> p7 -> p8 -> p9
    
    # Target convergence tip before arrow: (365, 185)
    line_w = int(13 * scale)
    
    wave_configs = [
        # (offset_y, opacity)
        (-56, 255),
        (-18, 255),
        (20, 255),
        (58, 255)
    ]
    
    # We will draw 3 prominent, ultra-clean harmonic streams:
    # Stream 1 (top): starts at (105, 240)
    # Stream 2 (mid): starts at (105, 278)
    # Stream 3 (bot): starts at (105, 316)
    
    streams = [
        {
            "p0": (105, 235), "p1": (145, 175), "p2": (185, 175), "p3": (225, 235),
            "p4": (260, 285), "p5": (295, 285), "p6": (330, 245),
            "p7": (360, 210), "p8": (375, 185), "p9": (390, 160)
        },
        {
            "p0": (105, 275), "p1": (145, 215), "p2": (185, 215), "p3": (225, 275),
            "p4": (260, 325), "p5": (295, 325), "p6": (330, 280),
            "p7": (362, 235), "p8": (382, 195), "p9": (398, 168)
        },
        {
            "p0": (105, 315), "p1": (145, 255), "p2": (185, 255), "p3": (225, 315),
            "p4": (260, 365), "p5": (295, 365), "p6": (330, 320),
            "p7": (365, 265), "p8": (388, 215), "p9": (406, 176)
        }
    ]

    for s in streams:
        pts1 = cubic_bezier(s["p0"], s["p1"], s["p2"], s["p3"], steps=40)
        pts2 = cubic_bezier(s["p3"], s["p4"], s["p5"], s["p6"], steps=40)
        pts3 = cubic_bezier(s["p6"], s["p7"], s["p8"], s["p9"], steps=40)
        all_pts = pts1[:-1] + pts2[:-1] + pts3
        
        # Draw smooth line
        for i in range(len(all_pts) - 1):
            draw.line([all_pts[i], all_pts[i+1]], fill=(255, 255, 255, 255), width=line_w)
            draw.ellipse([all_pts[i][0] - line_w//2, all_pts[i][1] - line_w//2,
                          all_pts[i][0] + line_w//2, all_pts[i][1] + line_w//2], fill=(255, 255, 255, 255))
        draw.ellipse([all_pts[-1][0] - line_w//2, all_pts[-1][1] - line_w//2,
                      all_pts[-1][0] + line_w//2, all_pts[-1][1] + line_w//2], fill=(255, 255, 255, 255))

    # 3. Arrow head (Clean, sharp geometric arrowhead aligned at ~52 degrees)
    tip = (int(434 * scale), int(122 * scale))
    left_corner = (int(372 * scale), int(152 * scale))
    right_corner = (int(404 * scale), int(202 * scale))
    draw.polygon([tip, left_corner, right_corner], fill=(255, 255, 255, 255))

    # 4. Subtle Time Horizon & Anchor
    horizon_y = int(366 * scale)
    dash_start_x = int(245 * scale)
    dash_end_x = int(370 * scale)
    dash_w = int(4 * scale)
    
    # Clean dashed timeline
    step = int(14 * scale)
    d_len = int(8 * scale)
    for x in range(dash_start_x, dash_end_x, step):
        draw.line([(x, horizon_y), (min(x + d_len, dash_end_x), horizon_y)], 
                  fill=(255, 255, 255, 80), width=dash_w)
        
    # Future target horizon node
    dot_r = int(7 * scale)
    dot_x = int(395 * scale)
    draw.ellipse([dot_x - dot_r, horizon_y - dot_r, dot_x + dot_r, horizon_y + dot_r], fill=(255, 255, 255, 220))

    return img

# Execute and build all assets
print("Building master icon...")
master = render_master_icon(1024)

public_dir = "c:/Users/Santiago/OneDrive/Escritorio/Repositorios/Forecasting/frontend/public"

# 1. High-res PNGs
sizes = {
    "icon-512.png": 512,
    "icon-192.png": 192,
    "apple-touch-icon.png": 180,
    "icon-64.png": 64,
    "icon-32.png": 32,
    "icon-16.png": 16
}

for filename, s in sizes.items():
    res = master.resize((s, s), Image.Resampling.LANCZOS)
    res.save(f"{public_dir}/{filename}")
    print(f"Saved {filename} ({s}x{s})")

# 2. Multi-size Windows / Browser Favicon (.ico)
ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
master.save(f"{public_dir}/favicon.ico", format="ICO", sizes=ico_sizes)
print("Saved favicon.ico with multi-resolution payload")

# 3. Clean Vector SVG (favicon.svg & logo.svg)
svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#101317" />
      <stop offset="100%" stop-color="#07080a" />
    </linearGradient>
  </defs>

  <!-- Obsidian squircle background with subtle border -->
  <rect x="24" y="24" width="464" height="464" rx="116" fill="url(#bg)" stroke="#ffffff" stroke-opacity="0.10" stroke-width="2.5" />

  <!-- Time Series Wave 1 (Upper stream) -->
  <path d="M 105 235 C 145 175, 185 175, 225 235 C 260 285, 295 285, 330 245 C 360 210, 375 185, 390 160" 
        fill="none" stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Time Series Wave 2 (Center stream) -->
  <path d="M 105 275 C 145 215, 185 215, 225 275 C 260 325, 295 325, 330 280 C 362 235, 382 195, 398 168" 
        fill="none" stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Time Series Wave 3 (Lower stream) -->
  <path d="M 105 315 C 145 255, 185 255, 225 315 C 260 365, 295 365, 330 320 C 365 265, 388 215, 406 176" 
        fill="none" stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Forecast Vector Arrow -->
  <polygon points="434,122 372,152 404,202" fill="#FFFFFF" />

  <!-- Time Horizon Baseline -->
  <line x1="245" y1="366" x2="370" y2="366" stroke="#FFFFFF" stroke-opacity="0.32" stroke-width="4" stroke-dasharray="8 6" stroke-linecap="round" />
  <circle cx="395" cy="366" r="7" fill="#FFFFFF" fill-opacity="0.85" />
</svg>
"""

with open(f"{public_dir}/favicon.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)
with open(f"{public_dir}/logo.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Saved favicon.svg and logo.svg successfully!")
