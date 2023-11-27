# Obsidian molecule renderer
Allows you to render molecules by their name inside a `molecule` codeblock

Uses pubchem to retrieve information about the chemical.

## molecule codeblock

Use the molecule codeblock to display a 2d image of a molecule. Place the molecule name inside the codeblock, formatted similarly to the names specified on pubchem.\
\
For example:
````md
```molecule
peroxide, dibenzoyl
```
````
produces:\
<img width="384" alt="image" src="https://github.com/tnichols217/obsidian-molecule-renderer/assets/62992267/dbbddd2d-49e7-4836-94ea-e4d07afc000a">

## molecule3d codeblock
Exactly the same as the molecule codeblock except will render the molecule in interactive 3d.\
Sometimes has issues with pdf export.\
\
For example:
````md
```molecule3d
peroxide, dibenzoyl
```
````
produces:\
<img width="423" alt="image" src="https://github.com/tnichols217/obsidian-molecule-renderer/assets/62992267/7f32b0a0-00c5-4e87-ae7f-a98fd6f9d643">


## TODO:
1. Add support for plain SMILES without molecule name
2. Add custom color support

---

### If you enjoy my plugin, please consider supporting me:

<a href="https://www.buymeacoffee.com/tnichols217" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="217" height="60" /></a>
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/D1D0DF7HF)
