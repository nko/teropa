(use 'clojure.contrib.duck-streams)
(import '(javax.imageio ImageIO))

(def cntr (atom 0))

(defn to-int-arr [strs]
  (into-array
    Integer/TYPE
    (map #(Integer/valueOf %) strs)))
   
(doseq [line (read-lines "/tmp/tiles.txt")]
  (swap! cntr inc)
  (println "Drawing" @cntr)
  (let [[tile r g b a poly] (.split line " ")
  		img-file (java.io.File. tile)
  		img (ImageIO/read img-file)
  		coords (.split poly ",")
  		xpoints (to-int-arr (take-nth 2 coords))
  		ypoints (to-int-arr (take-nth 2 (rest coords)))
  		g2d (.getGraphics img)]
  	(.setPaint g2d (java.awt.Color. (Integer/valueOf r) (Integer/valueOf g) (Integer/valueOf b) (Integer/valueOf a)))
  	(.fillPolygon g2d xpoints ypoints (/ (count coords) 2))
  	(.dispose g2d)
  	(ImageIO/write img "png" img-file)))
  	
  	
  	
  	
	