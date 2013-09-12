{
  "title": "md_meta.html",
  "message": "A message from md_meta.md!",
  "body_class": "markdown",
  "template": "default"
}

<div class="header">md_meta.md</div>

### A page written in markdown

This page is compiled to <span class="filename">mm_meta.html</span> in tmp, and will include the compiled contents of <span class="filename">dot_md_partial</span>: <div class="partial"><div class="header">dot_md_partial.md</div>{{= it.include('dot_md_partial.md') }}</div>