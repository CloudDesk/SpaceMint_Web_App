import argparse
import pathlib
import sys

import bpy


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def convert_file(source: pathlib.Path, target: pathlib.Path) -> None:
    clear_scene()
    target.parent.mkdir(parents=True, exist_ok=True)

    bpy.ops.wm.collada_import(filepath=str(source))

    bpy.ops.export_scene.gltf(
        filepath=str(target),
        export_format="GLB",
        export_apply=True,
        export_yup=True,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert COLLADA .dae files to binary glTF .glb files.")
    parser.add_argument("input", help="Input .dae file or directory containing .dae files")
    parser.add_argument("output", help="Output .glb file or directory")
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else None)

    input_path = pathlib.Path(args.input).resolve()
    output_path = pathlib.Path(args.output).resolve()

    if input_path.is_dir():
        dae_files = sorted(input_path.rglob("*.dae"))
        if not dae_files:
            raise SystemExit(f"No .dae files found in {input_path}")

        output_path.mkdir(parents=True, exist_ok=True)
        for dae_file in dae_files:
            relative = dae_file.relative_to(input_path).with_suffix(".glb")
            convert_file(dae_file, output_path / relative)
            print(f"Converted {dae_file} -> {output_path / relative}")
        return 0

    if input_path.suffix.lower() != ".dae":
        raise SystemExit("Input file must be a .dae file")

    target = output_path if output_path.suffix.lower() == ".glb" else output_path / input_path.with_suffix(".glb").name
    convert_file(input_path, target)
    print(f"Converted {input_path} -> {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
