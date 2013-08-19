# bluebox 

> A node library to use the Bluebox Group API

## Jump to Section

* [Installation](#installation)
* [Examples](#examples)
* [API](#api)
* [License](#license)

## Installation
[[Back To Top]](#jump-to-section)

    npm install bluebox --save


## Examples
[[Back To Top]](#jump-to-section)

    var Bluebox = require('bluebox');

    var credentials = {
      'customer_id': <insert yours>,
      'api_key': <insert your>
    };

    var api = new Bluebox(credentials);

    api.block_list({},function(err, blocks) {
      console.log(blocks);
    });

    api.block_details({uid: 'abc1234...' },function(err, block) {
      console.log(block);
    });


## API
[[Back To Top]](#jump-to-section)

You can find the full detailed API descriptions at:
<http://jedi4ever.github.com/bluebox.js>

All API calls follow the same pattern:

    api.method_name(options, callback);

Implementated methods are:

- block_list
- block_details
- block_create
- block_reboot
- block_destroy

- template_list
- template_create
- template_details
- template_destroy

- location_list

- product_list


## License
[[Back To Top]](#jump-to-section)

Copyright (c) 2010-2013 Patrick Debois

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


