import math
from PIL import Image, ImageDraw

def create_squircle_mask(size, radius):
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, size, size], radius=radius, fill=255)
    return mask

def draw_concept_1(size=1024):
    """
    Concept 1: Multi-series harmonic waves converging into an upward forecast arrow.
    Super-sampled at 1024x1024.
    """
    scale = size / 512.0
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 1. Base Squircle (Obsidian / Titanium dark)
    pad = int(24 * scale)
    r = int(112 * scale)
    # Squircle background
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, fill=(13, 15, 18, 255))
    # Elegant subtle border
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, outline=(255, 255, 255, 30), width=int(3 * scale))
    
    # Waves parameters
    # Left start: x ~ 100, Crest 1: x ~ 180, Trough: x ~ 260, Upward lift: x ~ 330 -> arrow at 400, 160
    
    # Let's draw 3 harmonic lines with smooth curves
    def wave_pt(x, offset_y, phase_shift=0):
        # Normalized x along wave from 100 to 320
        if x <= 310:
            nx = (x - 100) / 210.0 * 2.0 * math.pi
            # Sine wave with increasing slope towards the end
            y = 280 + offset_y - 45 * math.sin(nx + phase_shift)
        else:
            # Convergence and upward trend
            t = (x - 310) / 80.0
            # Start at end of sine
            start_y = 280 + offset_y - 45 * math.sin(2.0 * math.pi + phase_shift)
            target_y = 175 + (offset_y * 0.15)  # converge close together
            # smooth interpolation
            y = start_y + (target_y - start_y) * (t ** 1.3)
        return x, y

    # Generate points for 3 curves
    curves = [
        (-48, 0.0),    # Top wave
        (0, 0.2),      # Mid wave
        (48, 0.4)      # Bottom wave
    ]
    
    line_w = int(14 * scale)
    
    for offset_y, phase in curves:
        pts = []
        for x in range(int(105 * scale), int(380 * scale), int(2 * scale)):
            rx = x / scale
            _, ry = wave_pt(rx, offset_y, phase)
            pts.append((x, int(ry * scale)))
        
        # Draw line with rounded joints
        for i in range(len(pts) - 1):
            draw.line([pts[i], pts[i+1]], fill=(255, 255, 255, 250), width=line_w)
            draw.ellipse([pts[i][0] - line_w//2, pts[i][1] - line_w//2, 
                          pts[i][0] + line_w//2, pts[i][1] + line_w//2], fill=(255, 255, 255, 250))

    # Arrow head pointing ~ 55 deg
    # Center tip at (420, 135)
    tip = (int(422 * scale), int(135 * scale))
    left = (int(365 * scale), int(172 * scale))
    right = (int(398 * scale), int(220 * scale))
    draw.polygon([tip, left, right], fill=(255, 255, 255, 255))
    
    # Baseline timeline horizon (discrete points / dashed line)
    dash_y = int(370 * scale)
    for dx in range(int(260 * scale), int(370 * scale), int(16 * scale)):
        draw.line([(dx, dash_y), (dx + int(8 * scale), dash_y)], fill=(255, 255, 255, 90), width=int(4 * scale))
    
    # Present time anchor dot
    dot_r = int(7 * scale)
    dot_cx = int(395 * scale)
    draw.ellipse([dot_cx - dot_r, dash_y - dot_r, dot_cx + dot_r, dash_y + dot_r], fill=(255, 255, 255, 230))
    
    return img

def draw_concept_2(size=1024):
    """
    Concept 2: Swiss Minimalist - Classic Time Series (Historic Continuous Spline)
    crossing Time-Zero Axis and projecting as an Upward Dashed Forecast.
    """
    scale = size / 512.0
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    pad = int(24 * scale)
    r = int(112 * scale)
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, fill=(11, 13, 16, 255))
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, outline=(255, 255, 255, 28), width=int(3 * scale))
    
    # Center origin t=0 at x = 256
    cx = int(256 * scale)
    cy = int(270 * scale)
    
    # 1. Subtle Coordinate Grid Axis
    # Horizontal axis
    draw.line([(int(90 * scale), cy), (int(422 * scale), cy)], fill=(255, 255, 255, 50), width=int(3 * scale))
    # Vertical axis (Present Time t_0)
    draw.line([(cx, int(110 * scale)), (cx, int(400 * scale))], fill=(255, 255, 255, 75), width=int(3 * scale))
    
    # Axis labels / ticks
    draw.line([(cx - int(5 * scale), int(170 * scale)), (cx + int(5 * scale), int(170 * scale))], fill=(255, 255, 255, 80), width=int(3 * scale))
    draw.line([(cx - int(5 * scale), int(370 * scale)), (cx + int(5 * scale), int(370 * scale))], fill=(255, 255, 255, 80), width=int(3 * scale))

    # 2. Historical Past Wave (Solid Line x: 100 -> 256)
    w_solid = int(14 * scale)
    pts_past = []
    for x in range(int(96 * scale), cx + 1, int(2 * scale)):
        rx = (x - int(96 * scale)) / (cx - int(96 * scale))
        # 1.5 cycles of sine wave
        val = math.sin(rx * 3.0 * math.pi)
        y = cy - val * (70 * scale)
        pts_past.append((x, int(y)))
        
    for i in range(len(pts_past) - 1):
        draw.line([pts_past[i], pts_past[i+1]], fill=(255, 255, 255, 255), width=w_solid)
        draw.ellipse([pts_past[i][0] - w_solid//2, pts_past[i][1] - w_solid//2,
                      pts_past[i][0] + w_solid//2, pts_past[i][1] + w_solid//2], fill=(255, 255, 255, 255))
        
    # Origin Node at (t=0, y0)
    origin_y = pts_past[-1][1]
    or_r = int(10 * scale)
    draw.ellipse([cx - or_r, origin_y - or_r, cx + or_r, origin_y + or_r], fill=(255, 255, 255, 255))
    
    # 3. Forecast Horizon (Dashed upward projection)
    pts_forecast = []
    for x in range(cx, int(410 * scale), int(2 * scale)):
        rx = (x - cx) / (154 * scale)
        # exponential/polynomial upward curve
        y = origin_y - (rx ** 1.4) * (140 * scale)
        pts_forecast.append((x, int(y)))
        
    # Draw dashed line
    dash_len = int(14 * scale)
    gap_len = int(10 * scale)
    curr_len = 0
    drawing = True
    
    for i in range(len(pts_forecast) - 1):
        p1 = pts_forecast[i]
        p2 = pts_forecast[i+1]
        seg_len = math.hypot(p2[0] - p1[0], p2[1] - p1[1])
        curr_len += seg_len
        
        if drawing:
            draw.line([p1, p2], fill=(255, 255, 255, 255), width=w_solid)
            draw.ellipse([p1[0] - w_solid//2, p1[1] - w_solid//2,
                          p1[0] + w_solid//2, p1[1] + w_solid//2], fill=(255, 255, 255, 255))
            if curr_len >= dash_len:
                drawing = False
                curr_len = 0
        else:
            if curr_len >= gap_len:
                drawing = True
                curr_len = 0
                
    # Terminal forecast vector arrow
    last_pt = pts_forecast[-1]
    arrow_tip = (last_pt[0] + int(14 * scale), last_pt[1] - int(16 * scale))
    a_left = (last_pt[0] - int(16 * scale), last_pt[1] + int(2 * scale))
    a_bottom = (last_pt[0] + int(4 * scale), last_pt[1] + int(20 * scale))
    draw.polygon([arrow_tip, a_left, a_bottom], fill=(255, 255, 255, 255))

    return img

print("Generating concept renderings...")
img1 = draw_concept_1(1024)
img1.resize((512, 512), Image.Resampling.LANCZOS).save("c:/Users/Santiago/OneDrive/Escritorio/Repositorios/Forecasting/frontend/public/icon_concept_1.png")

img2 = draw_concept_2(1024)
img2.resize((512, 512), Image.Resampling.LANCZOS).save("c:/Users/Santiago/OneDrive/Escritorio/Repositorios/Forecasting/frontend/public/icon_concept_2.png")
print("Done!")
