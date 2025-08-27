import type { PromptModule, AdvancedWorkflow } from '../types';

export const PROMPT_MODULES: PromptModule[] = [
  { id: 'photo_realism', label: 'Photo Realism', text: 'Prioritize photorealism: accurate lighting, real textures, natural imperfections.' },
  { id: 'packshot', label: 'Product Packshot', text: 'E-commerce packshot: front view, pure white background, even lighting, no shadows.' },
  { id: 'cinematic_lighting', label: 'Cinematic Lighting', text: 'Apply cinematic lighting principles, with dramatic shadows and high contrast to create a moody, filmic atmosphere.' },
  { id: 'vintage_look', label: 'Vintage Look', text: 'Emulate the aesthetic of a vintage photograph, with faded colors, grain, and slight imperfections characteristic of old film.' },
];

export const ADVANCED_WORKFLOWS: AdvancedWorkflow[] = [
  {
    id: 'workflow_virtual_try_on',
    label: 'Virtual Try-On',
    image_slots: [
      { id: 'Img1', label: 'Model' },
      { id: 'Img2', label: 'Top' },
      { id: 'Img3', label: 'Bottom' },
      { id: 'Img4', label: 'Shoes' },
      { id: 'Img5', label: 'Accessory (Opt.)' },
    ],
    system_prompt: `// SYSTEM PROMPT: HIGH-FIDELITY VIRTUAL TRY-ON

**Model:** Gemini 2.5 Flash Image
**Objective:** High-Fidelity Virtual Try-On

**Source Assets:**
- Img1: [Subject] The person, pose, and background scene.
- Img2: [Top] The upper-body garment.
- Img3: [Bottom] The lower-body garment.
- Img4: [Shoes] The footwear.
- Img5: [Accessory] The optional item (bag, jewelry, etc.).

**Core Task:** Render a single photorealistic image of the [Subject] from Img1 wearing the items from Img2, Img3, Img4, and Img5 within the original scene from Img1.

**Execution Rules (Strict):**

1.  **SUBJECT & SCENE - DO NOT CHANGE:**
    -   The [Subject]'s face, hairstyle, skin tone, and body proportions from Img1 are immutable.
    -   The background, environment, and lighting source from Img1 are immutable.

2.  **GARMENT APPLICATION - REALISTIC FIT:**
    -   Apply [Top], [Bottom], and [Shoes] to the [Subject].
    -   Fabric must drape and fold according to the [Subject]'s pose.
    -   Render realistic shadows and highlights on all new garments, consistent with the original lighting physics of the scene.
    -   Ensure seamless transitions between clothing items (e.g., top and bottom).

3.  **ACCESSORY PLACEMENT (If Img5 exists):**
    -   Place the [Accessory] in a natural, context-aware position on the [Subject].

4.  **FINAL OUTPUT:**
    -   The final image must be clean, cohesive, and indistinguishable from a real photograph.
    -   No visual artifacts, glitches, or unnatural seams.`,
  },
  {
    id: 'workflow_beauty_ad',
    label: 'Beauty Ad Campaign',
    image_slots: [
      { id: 'Img1', label: 'Model Face' },
      { id: 'Img2', label: 'Product Swatch' },
      { id: 'Img3', label: 'Mood (Opt.)' },
    ],
    system_prompt: `// SYSTEM PROMPT: HIGH-IMPACT BEAUTY ADVERTISING

**Objective:** Create a photorealistic beauty campaign image featuring a specific makeup look.

**Source Assets:**
- Img1: [Model] A clear, well-lit portrait of the model's face.
- Img2: [Product Swatch] A reference image showing the exact color and texture of the makeup (e.g., a smear of lipstick, a dab of eyeshadow).
- Img3: [Inspiration (Optional)] An image that defines the desired mood, lighting, or style.

**Core Task:** Apply the makeup properties from [Product Swatch] onto the [Model] to create a flawless, commercial-quality beauty advertisement.

**Execution Rules (Strict):**

1.  **MODEL IDENTITY - PRESERVE:**
    -   The [Model]'s facial structure, eye color, and unique features from Img1 are immutable. Do not alter their identity.
    -   Retain a natural-looking skin texture. Avoid an overly airbrushed or plastic look.

2.  **MAKEUP APPLICATION - PRECISION:**
    -   **Product:** Analyze the color, texture (e.g., matte, glossy, metallic), and opacity of the [Product Swatch] from Img2.
    -   **Application:** Apply this product to the designated area on the [Model]'s face (e.g., "lips," "eyelids," "cheeks"). The application must be precise and professional.
    -   **Look:** Create a "luminous glow" skin finish, sharp "winged eyeliner," and subtly defined brows.

3.  **LIGHTING & MOOD - ART DIRECTION:**
    -   Render the scene with "softbox studio lighting" to create soft shadows and highlight the makeup's texture.
    -   The mood should be elegant, modern, and luxurious, drawing inspiration from Img3 if provided.

4.  **FINAL OUTPUT:**
    -   The final image must be ultra-high resolution, suitable for print and digital advertising.
    -   The focus must be on the makeup, making it look desirable and perfectly applied.`,
  },
  {
    id: 'workflow_fashion_ad',
    label: 'Fashion Ad Campaign',
    image_slots: [
      { id: 'Img1', label: 'Model' },
      { id: 'Img2', label: 'Outfit' },
      { id: 'Img3', label: 'Location' },
    ],
    system_prompt: `// SYSTEM PROMPT: NARRATIVE FASHION ADVERTISING

**Objective:** Create a cinematic and emotive fashion campaign image.

**Source Assets:**
- Img1: [Model] Full-body shot of the fashion model.
- Img2: [Outfit] A complete outfit (can be multiple images for top, bottom, etc.).
- Img3: [Location] The desired background or environment for the campaign.

**Core Task:** Place the [Model] into the [Location], dress them in the [Outfit], and generate an image with a strong, specific editorial mood.

**Execution Rules (Strict):**

1.  **MODEL & OUTFIT - INTEGRATE:**
    -   Preserve the [Model]'s face and likeness from Img1.
    -   Dress the [Model] in the full [Outfit] from Img2. The clothing must show realistic movement and interaction with the model's pose (e.g., wind blowing a coat, fabric stretching).

2.  **SCENE & NARRATIVE - CREATE:**
    -   Compose the scene using the [Location] from Img3 as the backdrop.
    -   The [Model]'s pose and expression should be dynamic and emotive, not static.
    -   The overall mood is "urban chic at golden hour."

3.  **CINEMATIC STYLE - EMULATE:**
    -   **Lighting:** The lighting on the model and clothes MUST perfectly match the "golden hour" light source of the [Location]. Create long, soft shadows.
    -   **Lens Effect:** Render the image as if shot with a 50mm prime lens at f/1.8, creating a shallow depth of field where the background is softly blurred.
    -   **Color Grade:** Apply a warm, slightly desaturated color grade to the final image for a timeless, editorial feel.

4.  **FINAL OUTPUT:**
    -   The image should look like a page from a high-fashion magazine, telling a story and evoking aspiration.`,
  },
  {
    id: 'workflow_product_still_life',
    label: 'Product Still Life',
    image_slots: [
      { id: 'Img1', label: 'Product' },
      { id: 'Img2', label: 'Surface' },
      { id: 'Img3', label: 'Elements (Opt.)' },
    ],
    system_prompt: `// SYSTEM PROMPT: LUXURY PRODUCT STILL LIFE

**Objective:** Create a captivating, high-end still life advertisement for a luxury product.

**Source Assets:**
- Img1: [Product] A clean, studio shot of the product (e.g., a watch, perfume bottle, handbag).
- Img2: [Surface] A reference for the texture the product will sit on (e.g., marble, dark wood, brushed metal).
- Img3: [Elements] Optional items to include in the scene (e.g., a sprig of lavender, a silk cloth, water droplets).

**Core Task:** Place the [Product] into a beautifully composed scene on the specified [Surface], surrounded by tasteful [Elements], and lit dramatically.

**Execution Rules (Strict):**

1.  **PRODUCT INTEGRITY - HERO:**
    -   The [Product] from Img1 is the hero of the image. Its shape, color, material, and branding must be perfectly and accurately rendered.
    -   Showcase the product's material properties (e.g., the gleam of gold, the texture of leather, the transparency of glass).

2.  **SCENE COMPOSITION - ART DIRECT:**
    -   Place the [Product] on the [Surface] from Img2.
    -   Arrange the [Elements] from Img3 artfully around the product to enhance its story. The composition should be minimalist and elegant.
    -   The background should be a simple, dark, out-of-focus gradient.

3.  **LIGHTING & ATMOSPHERE - DRAMA:**
    -   Use "chiaroscuro lighting"—a strong, single light source that creates high contrast between light and deep shadows.
    -   The lighting should catch the edges of the product, defining its form and texture.
    -   If water droplets are an element, they should look crisp and realistic.

4.  **FINAL OUTPUT:**
    -   An image that feels tactile, luxurious, and premium. It must be sharp, detailed, and command attention.`,
  },
  {
    id: 'workflow_cinema_scene',
    label: 'Cinema Scene',
    image_slots: [
      { id: 'Img1', label: 'Master Shot' },
      { id: 'Img2', label: 'New Element (Opt.)' },
    ],
    system_prompt: `// SYSTEM PROMPT: CINEMATIC SCENE CONTINUITY

**Objective:** Generate a new shot within a cinematic scene while maintaining perfect continuity of character and location.

**Source Assets:**
- Img1: [Master Shot] The key reference image establishing the character, their wardrobe, and the location.
- Img2: [New Element (Optional)] An object or character to be added to the scene.

**Core Task:** Create a new image that functions as a different camera angle or a subsequent moment in time from the [Master Shot], while strictly preserving all established visual elements.

**Execution Rules (Strict):**

1.  **CONTINUITY LOCK - IMMUTABLE ELEMENTS:**
    -   **Character:** The character's appearance (face, hair, wardrobe) from the [Master Shot] is locked. Do not change their clothes or features.
    -   **Location:** The environment (architecture, props, furniture) from the [Master Shot] is locked. Do not change the set dressing.
    -   **Lighting:** The time of day and lighting setup (e.g., "overcast daylight through a window") from the [Master Shot] are locked.

2.  **NEW SHOT - DIRECT THE ACTION:**
    -   **Action:** The character is now performing a new action: "picking up a coffee mug from the table."
    -   **Framing:** The new shot should be a "medium close-up," focusing on the character's upper body and the action.
    -   **Lens Style:** Render with a slight "anamorphic lens flare" consistent with the [Master Shot]'s cinematic style.

3.  **INTEGRATION (If Img2 exists):**
    -   Seamlessly integrate the [New Element] into the scene, ensuring it adheres to the locked lighting and perspective rules.

4.  **FINAL OUTPUT:**
    -   The generated image must look like it was filmed on the same day, on the same set, with the same actor and camera as the [Master Shot]. It must be a believable part of the same continuous scene.`,
  },
];

export const ALL_PROMPTS = {
    modules: PROMPT_MODULES,
    workflows: ADVANCED_WORKFLOWS,
};