# Matter
My atomic library


[![Task runner](https://img.shields.io/badge/task%20runner-Gulp-CF4646.svg?style=flat)](http://gulpjs.com/)
[![Styling](https://img.shields.io/badge/styling-Sass-C6538C.svg?style=flat)](http://sass-lang.com/)
[![Templating](https://img.shields.io/badge/templating-Nunjucks-brightgreen.svg?style=flat)](https://mozilla.github.io/nunjucks/)

## BEM
Matter uses the *block, element and modifier* (BEM) methodology. The default is `.block__element--modifier` but you can choose your own beming style.

In `sass/core/_variables.scss` we have define `$b`, `$e` and `$m` for this usage. Let's see how it works with this silly example:

```
$b: '.narwhal'; // block name
$e: '&__'; // element separator
$m: '&--'; // modifier separator

#{$b} {
  float: left;

    #{$e}horn {
      display: block;
    
      #{$m}pretty-big {
        font-size: large;
    }
  }
}
```
Which produces this beautiful CSS:
```
.narwhal {
  float: left;
}

.narwhal__horn {
  display: block;
}

.narwhal__horn--pretty-big {
  font-size: large;
}
```


