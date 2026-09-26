# People photo archive

The page reads `albums.json`. Each entry is one numbered slideshow. Replace the temporary album names, add or remove albums, and list each album's photos in the order you want them shown. GitHub Pages cannot automatically list files in a folder, so each photo must be added to the manifest.

Suggested file layout: `people/photos/01/photo-01.jpg`, `people/photos/01/photo-02.jpg`, and so on. You can choose different filenames and folders; use the matching root-relative path in `src`.

Example album:

```json
{
  "number": "01",
  "name": "The album name",
  "photos": [
    {
      "src": "/people/photos/01/photo-01.jpg",
      "alt": "A description of what is visible in the photograph",
      "caption": "Optional caption or credit"
    }
  ]
}
```

Keep each `number` unique. Albums with no photos display a coming-soon state. Each album uses the original full-screen slideshow transition: click or swipe horizontally to move through its photos. On mobile, swipe up to see that album's photos in a grid; tapping a photo returns to the slideshow at that image. Visitors can link directly to an album with `/people/#01`.
