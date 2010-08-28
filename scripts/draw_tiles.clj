(use 'clojure.contrib.duck-streams)
(import '(javax.imageio ImageIO))

(def file (first *command-line-args*))

(defn to-int-arr [strs]
  (into-array
    Integer/TYPE
    (map #(Integer/valueOf %) strs)))
    
(doseq [line (read-lines file)]
  (let [[tile poly] (.split line " ")
  		img-file (java.io.File. tile)
  		img (ImageIO/read img-file)
  		coords (.split poly ",")
  		xpoints (to-int-arr (take-nth 2 coords))
  		ypoints (to-int-arr (take-nth 2 (rest coords)))
  		g (.getGraphics img)]
  	(.setPaint g java.awt.Color/RED)
  	(.fillPolygon g xpoints ypoints (/ (count coords) 2))
  	(ImageIO/write img "png" img-file)))
  	
  	
  	
  	
	