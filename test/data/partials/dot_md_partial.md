# This partial contains both dot variables as well as markdown

{{= it.dot_msg }}

As a final step, the file should be compiled from md to HTML.

{{= it.partials('test/data/partials/html_partial') }}