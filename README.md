# UnHinged — Laser Cut Living Hinge SVG Generator

An interactive, browser-based vector generator for creating precise **living hinges** for laser cutting. It generates clean, optimized SVG paths in real-time, allowing you to turn rigid materials like wood, acrylic, and cardboard into highly flexible curved structures.

![Interface Screenshot Mockup](https://raw.githubusercontent.com/DeadPull3000/UnHinged/main/screenshot_placeholder.png) *(Note: Add actual interface screenshot here after hosting/running)*

## ⚡ Features

* **Multiple Flex Patterns**:
  * **Straight Parallel**: The classic staggered brickwork pattern for general-purpose bending.
  * **Wave**: Sinusoidal curves that distribute bending stress more evenly, reducing risk of snapping.
  * **Honeycomb**: Organic hexagonal structure providing flex across multiple axes.
  * **Lattice (Cross)**: Highly flexible cross-pattern for multi-directional bending.
  * **Beach Ball (Gores)**: Spherical shell generator that maps and cuts 3D curves from flat sheets (e.g., dome caps, hemispheres, full spheres).
* **Smart Material Database**:
  * Select from **MDF, Plywood, Hardwood, Bamboo, Acrylic, PVC/Foam Board, Fiber Board, or Cardboard**.
  * Input your material thickness (0.5mm to 9mm+).
  * Get instant, tested recommendations for pattern types, cut lengths, gaps, and web spacing tailored specifically to your chosen material's stiffness and brittleness.
* **Instant Live Preview**:
  * Highly responsive UI that updates the vector preview container immediately as you slide or change values.
  * Displays path count and boundary dimensions dynamically.
* **Laser-Ready SVG Export**:
  * Generates clean `<path>` nodes with standard red strokes (`#FF0000`).
  * Supports **Hairline (0.001mm)** stroke weight format required by vector cutting software such as LightBurn, Glowforge, RDWorks, and CorelDRAW.

---

## 🛠️ Usage

### 1. Run Locally
UnHinged is built with zero external dependencies and runs purely in the client. To use it, simply:
1. Clone this repository.
2. Open `index.html` in any modern web browser.

### 2. Design Your Hinge
1. **Choose Material & Thickness**: Select your material and thickness, then click **Recommend Settings** to apply a starting baseline.
2. **Set Workpiece Dimensions**: Configure the width and height of the bounding cut box.
3. **Select Pattern**: Choose a flex style (Straight, Wave, Honeycomb, Lattice, or Beach Ball).
4. **Tune Parameters**:
   * *Cut Length*: Length of individual slit cuts.
   * *Gap Between Cuts*: Solid spacing left between end-to-end cuts along the same column.
   * *Web / Column Spacing*: Spacing between columns of cuts.
   * *Stagger Offset*: Phase offset (%) between adjacent cut columns.
5. **Download**: Click **Download SVG** to save your ready-to-cut vector file.

---

## 📐 Material Guidelines & Best Practices

| Material | Thickness (mm) | Recommended Pattern | Tip / Note |
| :--- | :--- | :--- | :--- |
| **Plywood** | 3.0mm | Straight | Highly forgiving. Great for structural projects. |
| **MDF** | 3.0mm | Straight | Cheap and flexes well, but fragile along columns if over-flexed. |
| **Acrylic** | 3.0mm | Straight | Heat-bending recommended. Snaps easily; keep webs wide (3.5mm+). |
| **Bamboo** | 3.0mm | Straight | Fibers are very strong, allowing tight spacing and high flexibility. |
| **Hardwood**| 3.0mm | Wave | Brittle; wave pattern distributes tension better than straight lines. |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute for both personal and commercial projects.
