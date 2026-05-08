# Run inside SketchUp Ruby to batch export .skp files to COLLADA .dae.
#
# Usage from SketchUp Ruby Console:
#   ENV["SPACEMINT_SKP_DIR"] = "D:/SpaceMint_Web_App/assests/sketches"
#   ENV["SPACEMINT_DAE_DIR"] = "D:/SpaceMint_Web_App/assests/converted-dae"
#   load "D:/SpaceMint_Web_App/scripts/sketchup-export-skp-to-dae.rb"
#
# Notes:
# - SketchUp must open each .skp because .skp is a proprietary format.
# - The generated .dae files can then be converted to .glb with Blender.

require "fileutils"

skp_dir = ENV["SPACEMINT_SKP_DIR"] || File.expand_path("../assests/sketches", __dir__)
dae_dir = ENV["SPACEMINT_DAE_DIR"] || File.expand_path("../assests/converted-dae", __dir__)

FileUtils.mkdir_p(dae_dir)

skp_files = Dir.glob(File.join(skp_dir, "**", "*.skp"))

if skp_files.empty?
  UI.messagebox("No .skp files found in:\n#{skp_dir}")
  raise "No .skp files found"
end

export_options = {
  triangulated_faces: true,
  doublesided_faces: true,
  edges: false,
  texture_maps: true,
  preserve_instancing: true,
}

skp_files.each_with_index do |skp_file, index|
  model_name = File.basename(skp_file, ".skp")
  dae_file = File.join(dae_dir, "#{model_name}.dae")

  puts "[#{index + 1}/#{skp_files.length}] Opening #{skp_file}"
  Sketchup.open_file(skp_file)

  model = Sketchup.active_model
  puts "Exporting #{dae_file}"
  ok = model.export(dae_file, export_options)

  puts ok ? "Exported #{dae_file}" : "Failed #{skp_file}"
end

UI.messagebox("Exported #{skp_files.length} SketchUp model(s) to:\n#{dae_dir}")
